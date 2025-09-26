import { type UserInfo } from "../types/types";

export async function getUsers(): Promise<UserInfo[]> {
    return [{
        displayName: "thphong2",
        avatar: "P",
        did: "did:web:localhost:5173:did:phong2",
    },
    {
        displayName: "thphong",
        avatar: "T",
        did: "did:web:localhost:5173:did:phong",
    },
    {
        displayName: "thphong3",
        avatar: "T",
        did: "did:key:jysdusydsjdjskdjisdu6262",
    }];
    //return [];
}

export async function getCurrentUserDid(): Promise<string> {
    return 'did:web:localhost:5173:did:phong';
}

export async function saveUser(user: UserInfo) {
    return null;
}