import { openDB } from 'idb';

export class IndexedDb {
    private static instance: IndexedDb;
    private database: string;
    private store: string;
    constructor(database: string, store: string) {
        this.database = database;
        this.store = store;
        openDB(database, 1, {
            upgrade(db) {
                db.createObjectStore(store);

            },
        });
    }

    public static getInstance(database: string, store: string): IndexedDb {
        if (!IndexedDb.instance) {
            IndexedDb.instance = new IndexedDb(database, store);
        }
        return IndexedDb.instance;
    }

    /**
     * Adds a key-value pair to the IndexedDB database.
     * @param key - The key used to identify the value in the IndexedDB database.
     * @param value - The value to be stored in the IndexedDB database.
     */
    public async saveValue(key: string, value: any) {
        const db = await openDB(this.database, 1);
        await db.put(this.store, value, key);
        db.close();
    }

    /**
     * Retrieves a value from the IndexedDB database based on a given key.
     * @param key - The key used to retrieve the value from the IndexedDB database.
     * @returns The retrieved value from the IndexedDB database, if it exists and is not expired. Otherwise, `null` is returned.
     */
    public async getValue(key: string) {
        const db = await openDB(this.database, 1);
        const value = await db.get(this.store, key);

        db.close();
        return value;

    }
}