

import { type UserInput, type UserInfo } from "../types/types";
import {
    createKeyPair,
    didKey,
    didWeb,
    didIOTA,
    type DidDocument,
    jwkToArrayBuffer
} from "did-core-sdk";
import { IndexedDb } from "../libs/indexed-db";
import { setSession } from "./session";
import { writable } from 'svelte/store';
import { savePrivateKey } from "./encrypt";

const dbInstance: IndexedDb = IndexedDb.getInstance();
const KEY_LIST_USER = 'user:list-users';
const CURRENT_USER = 'user:current-user';
export const currentUser = writable<UserInfo | undefined>(undefined);
export const listUsers = writable<UserInfo[]>([]);

function getKeyPublicKey(did: string) {
    return `user:publickey:${did}`;
}

function getKeyDidDoc(did: string) {
    return `user:didDoc:${did}`;
}

async function addUser(user: UserInfo) {
    let users = await getUsers();
    users.push(user);
    listUsers.set(users);
    await dbInstance.saveValue(KEY_LIST_USER, users);
}

export async function createUser(user: UserInput, password: string): Promise<UserInfo> {
    const keyPair = await createKeyPair();

    let did: string, doc: DidDocument;
    switch (user.didType) {
        case "key":
            ({ did, doc } = await didKey.create(keyPair.publicKeyJwk));
            break;
        case "web":
            ({ did, doc } = await didWeb.create(
                keyPair.publicKeyJwk,
                { didWeb: user.didWeb },
            ));
            break;
        case "blockchain":
            ({ did, doc } = await didIOTA.create(keyPair.publicKeyJwk, { privateKey: keyPair.privateKeyJwk }));
            break;
        default:
            throw new Error("Not supported did type");
    }

    const userInfo = {
        displayName: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        did: did
    }

    await setSession(did, password);
    if (keyPair.privateKeyJwk) {
        const pkArray = await jwkToArrayBuffer(keyPair.privateKeyJwk);
        await savePrivateKey(did, password, pkArray);
    }
    await addUser(userInfo);
    await setCurrentUser(userInfo);
    await dbInstance.saveValue(getKeyPublicKey(did), keyPair.publicKeyJwk);
    await dbInstance.saveValue(getKeyDidDoc(did), doc);

    return userInfo;
}

export async function getPublicKey(did: string): Promise<JsonWebKey | undefined> {
    return await dbInstance.getValue<JsonWebKey>(getKeyPublicKey(did));
}

export async function getDidDoc(did: string): Promise<DidDocument | undefined> {
    return await dbInstance.getValue<DidDocument>(getKeyDidDoc(did));
}

async function getUsers(): Promise<UserInfo[]> {

    let users = await dbInstance.getValue<UserInfo[]>(KEY_LIST_USER);
    if (!users) {
        users = [];
    }
    listUsers.set(users);
    return users;
}
getUsers();

async function getCurrentUser(): Promise<UserInfo | undefined> {
    let user = await dbInstance.getValue<UserInfo>(CURRENT_USER);
    if (!user) {
        let users = await getUsers();
        if (users?.length > 0) {
            user = users[0];
        }
    }
    currentUser.set(user);
    return user;
}
getCurrentUser();

export async function setCurrentUser(user: UserInfo) {
    await dbInstance.saveValue(CURRENT_USER, user);
    currentUser.set(user);
}
