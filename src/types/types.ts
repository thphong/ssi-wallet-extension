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