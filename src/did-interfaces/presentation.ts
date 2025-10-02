
import { IndexedDb } from "../libs/indexed-db";
import { writable } from 'svelte/store';
import { type VP } from "did-core-sdk";

const dbInstance: IndexedDb = IndexedDb.getInstance();
export const listPresentations = writable<VP[]>([]);

function getKeyOwnCredential(did: string) {
    return `presentation:own:${did}`;
}

export async function addPresentation(did: string, presenation: VP) {
    let presentations = await getPresentations(did);
    presentations.push(presenation);
    listPresentations.set(presentations);
    await dbInstance.saveValue(getKeyOwnCredential(did), presentations);
}

export async function getPresentations(did: string): Promise<VP[]> {

    let presentations = await dbInstance.getValue<VP[]>(getKeyOwnCredential(did));
    if (!presentations) {
        presentations = [];
    }
    listPresentations.set(presentations);
    return presentations;
}
