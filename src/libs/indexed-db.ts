import { openDB } from 'idb';

export class IndexedDb {
    private static instance: IndexedDb;
    private static database: string = "SSI-Storage";
    private static store: string = "Default";
    constructor() {
        openDB(IndexedDb.database, 1, {
            upgrade(db) {
                db.createObjectStore(IndexedDb.store);
            },
        });
    }

    public static getInstance(): IndexedDb {
        if (!IndexedDb.instance) {
            IndexedDb.instance = new IndexedDb();
        }
        return IndexedDb.instance;
    }

    public async saveValue(key: string, value: any) {
        const db = await openDB(IndexedDb.database, 1);
        await db.put(IndexedDb.store, value, key);
        db.close();
    }

    public async getValue<T = unknown>(key: string): Promise<T | undefined> {
        const db = await openDB(IndexedDb.database, 1);
        const value = await db.get(IndexedDb.store, key) as Promise<T | undefined>;
        db.close();
        return value;
    }
}