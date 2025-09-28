import { openDB, type IDBPDatabase } from 'idb';

export class IndexedDb {

    private dbName: string;
    private storeName: string;
    private dbp: Promise<IDBPDatabase>;

    constructor(database: string, store: string) {
        this.dbName = database;
        this.storeName = store;
        this.dbp = this.init(); // ensure store exists
    }

    private async init(): Promise<IDBPDatabase> {
        // Open with current version first (no upgrade)
        let db = await openDB(this.dbName);
        if (!db.objectStoreNames.contains(this.storeName)) {
            const nextVersion = db.version + 1;   // bump version to trigger upgrade
            db.close();
            const storeName = this.storeName;     // capture for closure
            db = await openDB(this.dbName, nextVersion, {
                upgrade(upgradeDb) {
                    if (!upgradeDb.objectStoreNames.contains(storeName)) {
                        upgradeDb.createObjectStore(storeName);
                    }
                },
            });
        }
        return db;
    }

    /** Put or update a value by key */
    public async saveValue(key: IDBValidKey, value: any): Promise<void> {
        const db = await this.dbp;
        await db.put(this.storeName, value, key);
    }

    /** Get a value by key */
    public async getValue(key: IDBValidKey): Promise<any> {
        const db = await this.dbp;
        return db.get(this.storeName, key);
    }

    /** Delete a key */
    public async deleteValue(key: IDBValidKey): Promise<void> {
        const db = await this.dbp;
        await db.delete(this.storeName, key);
    }

    /** Clear all entries in this store */
    public async clear(): Promise<void> {
        const db = await this.dbp;
        await db.clear(this.storeName);
    }

    /** Get all keys (handy for debugging) */
    public async keys(): Promise<IDBValidKey[]> {
        const db = await this.dbp;
        return db.getAllKeys(this.storeName);
    }

    /** Optional: close DB (usually not needed in web apps) */
    public async close(): Promise<void> {
        const db = await this.dbp;
        db.close();
    }
}