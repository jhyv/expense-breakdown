import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Person } from "../../models";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import ionicStorage from "../../storage/ionic.storage";
type PersonState = {
    personList: Person[],
};

type PersonActions = {
    savePerson: (item: Person) => any,
    updatePerson: (item: Person, id: any) => any,
};

const initialState = {
    personList: [],
};

const persistStorage: StateStorage = ionicStorage;

const storageOptions = {
    name: 'colleges.store',
    storage: createJSONStorage(() => persistStorage),
    partialize: (state: PersonState & PersonActions) => ({
        personList: []
    })
}

const usePersonStore = create<PersonState & PersonActions>()(
    persist(
        immer((set) => ({
            ...initialState,
            savePerson: (item: Person) => {
                set((state) => ({ personList: [...state.personList, item] }));
            },
            updatePerson: (item: Person, id: any) => {
                set((state) => ({
                    personList: state.personList.map((i) => {
                        if (i.id === id) {
                            return item;
                        }

                        return i;
                    })
                }));
            }
        })),
        storageOptions
    )
)

export default usePersonStore;