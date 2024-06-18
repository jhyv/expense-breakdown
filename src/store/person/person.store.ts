import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Person } from "../../models";
import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import ionicStorage from "../../storage/ionic.storage";
import { UUID } from "../../utils/person.utils";
type PersonState = {
    personList: Person[],
};

type PersonActions = {
    savePerson: (item: Person) => any,
    updatePerson: (item: Person, id: any) => any,
    reset: () => any,
};

const initialState: PersonState = {
    personList: [],
};

const persistStorage: StateStorage = ionicStorage;

const storageOptions = {
    name: 'person.store',
    storage: createJSONStorage(() => persistStorage),
    partialize: (state: PersonState & PersonActions) => ({
        personList: state.personList
    })
}

const usePersonStore = create<PersonState & PersonActions>()(
    persist(
        immer((set) => ({
            ...initialState,
            savePerson: (item: Person) => {
                item.id = UUID.generateId();

                return set((state) => ({
                    personList: [...state.personList, item]
                }));
            },
            updatePerson: (item: Person, id: any) => {
                return set((state) => ({
                    personList: state.personList.map((i) => {
                        if (i.id === id) {
                            return item;
                        }

                        return i;
                    })
                }));
            },
            reset: () => {
                set(initialState);
            },
        })),
        storageOptions
    )
)

export default usePersonStore;