// crypto/keystore.ts
export async function deriveStoreKey(password: string, salt: Uint8Array, iterations = 200_000) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
        "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false, // extractable = false
        ["encrypt", "decrypt"],
    );
}

export function randomBytes(n = 12) {
    const b = new Uint8Array(n);
    crypto.getRandomValues(b);
    return b;
}

export async function encryptAesGcm(key: CryptoKey, data: Uint8Array) {
    const iv = randomBytes(12);
    const ct = new Uint8Array(
        await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)
    );
    return { iv, ct };
}

export async function decryptAesGcm(key: CryptoKey, iv: Uint8Array, ct: Uint8Array) {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return new Uint8Array(pt);
}

