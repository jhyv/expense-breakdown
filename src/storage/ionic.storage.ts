
import { Drivers, Storage } from '@ionic/storage';

const storage = new Storage({
    name: '_expenseTracker',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

await storage.create();

const ionicStorage = {
    setItem: storage.set,
    getItem: storage.get,
    removeItem: storage.remove
};

export default ionicStorage;