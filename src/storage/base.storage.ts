import { UUID } from "../utils/person.utils";
import store from "./ionic.storage";

export class BaseStorage<T> {
    protected tableName: string = '';
    protected store = store;

    protected generateId() {
        return UUID.generateId();
    }

    async get(): Promise<T[]> {
        return await this.store.get(this.tableName) || [];
    }

    async save(item: any) {
        const items: T[] = await this.get();
        item.id = this.generateId();
        items.push(item);

        return await this.store.set(this.tableName, items);
    }

    async delete(id: any) {
        let items: T[] = await this.get();
        if (items.length === 0) return;

        items = items.filter((item: any) => item.id !== id);

        return await this.store.set(this.tableName, items);
    }

    async update(item: any, id: any) {
        let items: T[] = await this.get();
        if (items.length === 0) return false;

        items = items.map((i: any) => {
            if (i.id === id) {
                return item;
            }

            return i;
        });

        return await this.store.set(this.tableName, items);
    }
}