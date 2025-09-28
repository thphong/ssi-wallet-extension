import { openDB } from 'idb';

export class IndexedDb {
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

    public async saveValue(key: string, value: any) {
        const db = await openDB(this.database, 1);
        await db.put(this.store, value, key);
        db.close();
    }

    public async getValue<T = unknown>(key: string): Promise<T | undefined> {
        const db = await openDB(this.database, 1);
        const value = await db.get(this.store, key) as Promise<T | undefined>;
        db.close();
        return value;

    }
}