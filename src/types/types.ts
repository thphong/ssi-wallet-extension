export type DidType = "key" | "web" | "blockchain";

export type UserInput = {
    name: string;
    didType: DidType;
    urlDid: string;
}

export type UserInfo = {
    displayName: string;
    avatar: string;
    did: string;
}

export type SecretRecord = {
    id: string;                 // "main-private-key", "credentials"
    salt: Uint8Array;           // cho PBKDF2
    iv: Uint8Array;             // cho AES-GCM
    ct: Uint8Array;             // ciphertext
    createdAt: number;
    version: number;
};
