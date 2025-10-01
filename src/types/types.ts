
import { type VC } from "did-core-sdk";

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
    salt: ArrayBuffer;           // cho PBKDF2
    iv: ArrayBuffer;             // cho AES-GCM
    ct: ArrayBuffer;             // ciphertext
};
