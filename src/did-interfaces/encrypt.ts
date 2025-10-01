// app/keys.ts
import { deriveStoreKey, encryptAesGcm, decryptAesGcm, randomBytes, arrayBufferToJwk } from "did-core-sdk";
import { IndexedDb } from "../libs/indexed-db";
import { type SecretRecord } from "../types/types";

const dbInstance: IndexedDb = IndexedDb.getInstance();

function getKeyPrivateKey(did: string) {
    return `user:privatekey:${did}`;
}

export async function savePrivateKey(currentDid: string, password: string, rawPrivateKey: ArrayBuffer): Promise<void> {
    const salt = randomBytes(16);
    const kStore = await deriveStoreKey(password, salt);
    const { iv, ct } = await encryptAesGcm(kStore, rawPrivateKey);
    await dbInstance.saveValue(getKeyPrivateKey(currentDid), {
        salt, iv, ct
    });
}

export async function loadPrivateKey(currentDid: string, password: string): Promise<JsonWebKey> {
    const rec = await dbInstance.getValue<SecretRecord>(getKeyPrivateKey(currentDid));
    if (!rec) throw new Error("Not found");
    const kStore = await deriveStoreKey(password, rec.salt);
    const pt = await decryptAesGcm(kStore, rec.iv, rec.ct);
    const pkRes = await arrayBufferToJwk(pt, "pkcs8", { name: "Ed25519" }, ["sign"]);
    return pkRes;
}

