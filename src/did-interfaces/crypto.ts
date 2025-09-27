// app/keys.ts
import { deriveStoreKey, encryptAesGcm, decryptAesGcm, randomBytes } from "./keystore";
import { IndexedDb } from "../libs/indexed-db";

const dbInstance = IndexedDb.getInstance("SSI-storage", "KeyStore");

export async function savePrivateKey(password: string, rawPrivateKey: Uint8Array) {
    const salt = randomBytes(16);
    const kStore = await deriveStoreKey(password, salt);
    const { iv, ct } = await encryptAesGcm(kStore, rawPrivateKey);
    await dbInstance.saveValue('main-private-key', {
        id: "main-private-key",
        salt, iv, ct,
        version: 1,
        createdAt: Date.now(),
    });
}

export async function loadPrivateKey(password: string) {
    const rec = await dbInstance.getValue("main-private-key");
    if (!rec) throw new Error("Not found");
    const kStore = await deriveStoreKey(password, rec.salt);
    const pt = await decryptAesGcm(kStore, rec.iv, rec.ct);
    // Trả về Uint8Array secretKey, KHÔNG ghi ra storage
    return pt;
}

// app/session.ts
let sessionKey: CryptoKey | null = null;
let lockTimer: number | null = null;

export async function unlock(password: string) {
    const rec = await dbInstance.getValue("main-private-key");
    if (!rec) throw new Error("No key");
    sessionKey = await deriveStoreKey(password, rec.salt);
    armAutoLock(5 * 60_000); // 5 phút
}

export function isUnlocked() { return !!sessionKey; }

export function lockNow() {
    sessionKey = null;
    if (lockTimer) { clearTimeout(lockTimer); lockTimer = null; }
}

function armAutoLock(ms: number) {
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(lockNow, ms) as unknown as number;
}
