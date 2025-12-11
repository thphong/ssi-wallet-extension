
import { IndexedDb } from "../libs/indexed-db";
import { writable } from 'svelte/store';
import { type VC } from "did-core-sdk";

const dbInstance: IndexedDb = IndexedDb.getInstance();
export const listOwnCredentials = writable<VC[]>([]);
export const listDeliveryCredentials = writable<VC[]>([]);

function getKeyOwnCredential(did: string) {
    return `credential:own:${did}`;
}

function getKeyDeliveryCredential(did: string) {
    return `credential:delivery:${did}`;
}

function getKeyIndexCredential(did: string) {
    return `credential:index:${did}`;
}

function getKeyRevokedIndexCredential(did: string) {
    return `credential:removedindex:${did}`;
}

export async function addOwnCredential(did: string, cre: VC) {
    let credentials = await getOwnCredentials(did);
    credentials.push(cre);
    listOwnCredentials.set(credentials);
    await dbInstance.saveValue(getKeyOwnCredential(did), credentials);
}

export async function getOwnCredentials(did: string): Promise<VC[]> {

    let credentials = await dbInstance.getValue<VC[]>(getKeyOwnCredential(did));
    if (!credentials) {
        credentials = [];
    }
    listOwnCredentials.set(credentials);
    return credentials;
}

export async function getCurrentIdexCredentials(did: string): Promise<number> {
    let index = await dbInstance.getValue<number>(getKeyIndexCredential(did));
    if (!index) {
        index = 0;
    }
    return index;
}

export async function setRevokedIndexCredentials(did: string, index: number): Promise<void> {
    let setIndex = await getRevokedIndexCredentials(did);
    setIndex.add(index);
    await dbInstance.saveValue(getKeyRevokedIndexCredential(did), setIndex);
}

export async function getRevokedIndexCredentials(did: string): Promise<Set<number>> {
    let setIndex = await dbInstance.getValue<Set<number>>(getKeyRevokedIndexCredential(did));
    if (!setIndex) {
        setIndex = new Set<number>();
    }
    return setIndex;
}

export async function setCurrentIdexCredentials(did: string): Promise<void> {
    let index = await getCurrentIdexCredentials(did);
    index++;
    await dbInstance.saveValue(getKeyIndexCredential(did), index);
}

export async function addDeliveryCredential(did: string, cre: VC) {
    let credentials = await getDeliveryCredentials(did);
    credentials.push(cre);
    listDeliveryCredentials.set(credentials);
    await dbInstance.saveValue(getKeyDeliveryCredential(did), credentials);
}

export async function getDeliveryCredentials(did: string): Promise<VC[]> {

    let credentials = await dbInstance.getValue<VC[]>(getKeyDeliveryCredential(did));
    if (!credentials) {
        credentials = [];
    }
    listDeliveryCredentials.set(credentials);
    return credentials;
}