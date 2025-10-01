
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

export async function addDeliveryCredential(did: string, cre: VC) {
    let credentials = await getDeliveryCredentials(did);
    credentials.push(cre);
    listOwnCredentials.set(credentials);
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