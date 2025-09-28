// app/keys.ts
import { deriveStoreKey, encryptAesGcm, decryptAesGcm, randomBytes } from "did-core-sdk";
import { IndexedDb } from "../libs/indexed-db";

const dbInstance = IndexedDb.getInstance("SSI-storage", "KeyStore");

export async function savePrivateKey(currentDid: string, password: string, rawPrivateKey: ArrayBuffer): Promise<void> {
    const salt = randomBytes(16);
    const kStore = await deriveStoreKey(password, salt);
    const { iv, ct } = await encryptAesGcm(kStore, rawPrivateKey);
    await dbInstance.saveValue(currentDid, {
        id: currentDid,
        salt, iv, ct,
        version: 1,
        createdAt: Date.now(),
    });
}

export async function loadPrivateKey(currentDid: string, password: string): Promise<ArrayBuffer> {
    const rec = await dbInstance.getValue(currentDid);
    if (!rec) throw new Error("Not found");
    const kStore = await deriveStoreKey(password, rec.salt);
    const pt = await decryptAesGcm(kStore, rec.iv, rec.ct);
    return pt;
}

