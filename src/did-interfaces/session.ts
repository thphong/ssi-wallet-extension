
import { IndexedDb } from "../libs/indexed-db";
import { deriveStoreKey, encryptAesGcm, decryptAesGcm, randomBytes, toArrayBuffer } from "did-core-sdk";
import { type SecretRecord } from "../types/types";
import { writable, get } from 'svelte/store';

export const triggerRefreshSession = writable<number>(Date.now());
const passwordSession = writable<Map<string, string>>(new Map());

const dbInstance: IndexedDb = IndexedDb.getInstance();

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const messageOK = toArrayBuffer(new TextEncoder().encode("Ok"));

// ---- DB index helpers (work with either index-API or value-API) ----
function sessionIndexExpire(did: string) {
    return `session:expiresAt:${did}`;
}

function sessionIndexPass(did: string) {
    return `session:password:${did}`;
}

function setPassword(did: string, password: string) {
    const map = get(passwordSession);
    map.set(did, password);
}

export function getPassword(did: string) {
    const map = get(passwordSession);
    return map.get(did) || "";
}

// Try index-style first; fall back to value store if not available.
async function dbSetSessionExpiry(currentDid: string, expiresAtMs: number) {
    const key = sessionIndexExpire(currentDid);
    await dbInstance.saveValue(key, expiresAtMs);
}

async function dbGetSessionExpiry(currentDid: string): Promise<number | null> {
    const key = sessionIndexExpire(currentDid);
    const v = await dbInstance.getValue<number>(key);
    return typeof v === "number" ? v : v ? Number(v) : null;
}

async function refreshSession(currentDid: string): Promise<void> {
    const now = Date.now();
    const newExpiresAt = now + SESSION_TTL_MS;
    await dbSetSessionExpiry(currentDid, newExpiresAt);
}

// ---- Public API ----
function arrayBufferEquals(buf1: ArrayBuffer, buf2: ArrayBuffer): boolean {
    if (buf1.byteLength !== buf2.byteLength) return false;

    const view1 = new Uint8Array(buf1);
    const view2 = new Uint8Array(buf2);

    for (let i = 0; i < view1.length; i++) {
        if (view1[i] !== view2[i]) return false;
    }
    return true;
}

export async function setSession(currentDid: string, password: string) {
    const salt = randomBytes(16);
    const kStore = await deriveStoreKey(password, salt);
    const { iv, ct } = await encryptAesGcm(kStore, messageOK);
    await dbInstance.saveValue(
        sessionIndexPass(currentDid),
        {
            salt, iv, ct
        }
    );
    await refreshSession(currentDid);
    setPassword(currentDid, password);
}

export async function isSessionValid(currentDid: string): Promise<boolean> {
    if (!getPassword(currentDid)) {
        return false;
    }
    const expiresAt = await dbGetSessionExpiry(currentDid);
    if (!expiresAt || Date.now() >= expiresAt) {
        return false;
    }
    return true;
}

export async function unlock(currentDid: string, password: string) {
    const rec = await dbInstance.getValue<SecretRecord>(sessionIndexPass(currentDid));
    if (!rec) throw new Error("No Session");
    const kStore = await deriveStoreKey(password, rec.salt);
    const pt = await decryptAesGcm(kStore, rec.iv, rec.ct);
    if (arrayBufferEquals(pt, messageOK)) {
        await refreshSession(currentDid);
        triggerRefreshSession.set(Date.now());
        setPassword(currentDid, password);
    }
    else {
        throw new Error("Password is incorrect");
    }
}

export async function lock(currentDid: string) {
    const now = Date.now();
    const newExpiresAt = now;
    await dbSetSessionExpiry(currentDid, newExpiresAt);
    triggerRefreshSession.set(Date.now());
    setPassword(currentDid, "");
}



