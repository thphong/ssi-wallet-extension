

import { type UserInput, type UserInfo } from "../types/types";
import {
    createKeyPair,
    didKey,
    didWeb,
    didIOTA,
    type DidDocument,
} from "did-core-sdk";
import { IndexedDb } from "../libs/indexed-db";
import { setSession } from "./session";

const dbInstance = IndexedDb.getInstance("SSI-storage", "Users");
const KEY_LIST_USER = 'list-users';
const CURRENT_USER = 'current-user';

function getKeyPublicKey(did: string) {
    return `User:${did}:publickey`;
}

function getKeyDidDoc(did: string) {
    return `User:${did}:didDoc`;
}

async function addUser(user: UserInfo) {
    let users = await getUsers();
    users.push(user);
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
                user.urlDid,
            ));
            break;
        case "blockchain":
            ({ did, doc } = await didIOTA.create(keyPair.publicKeyJwk));
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
    await addUser(userInfo);
    await setCurrentUser(userInfo);
    await dbInstance.saveValue(getKeyPublicKey(did), keyPair.publicKeyJwk);
    await dbInstance.saveValue(getKeyDidDoc(did), doc);

    return userInfo;
}

export async function getUsers(): Promise<UserInfo[]> {

    let users = await dbInstance.getValue(KEY_LIST_USER);
    if (!users) {
        users = [];
    }
    return users;
}

export async function getCurrentUser(): Promise<UserInfo | null> {
    let user = await dbInstance.getValue(CURRENT_USER);
    if (!user) {
        user = null;
    }
    return user;
}

export async function setCurrentUser(user: UserInfo) {
    await dbInstance.saveValue(CURRENT_USER, user);
}
