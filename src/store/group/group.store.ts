import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import ionicStorage from "../../storage/ionic.storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UUID } from "../../utils/person.utils";
import { Group } from "../../models";

type GroupState = {
    groupList: Group[]
};

type GroupActions = {
    saveExpense: (item: Group) => any
};

const initialState: GroupState = {
    groupList: [],
};

const persistStorage: StateStorage = ionicStorage;

const storageOptions = {
    name: 'expense.store',
    storage: createJSONStorage(() => persistStorage),
    partialize: (state: GroupState & GroupActions) => ({
        expenseList: state.groupList
    })
}

const useGroupStore = create<GroupState & GroupActions>()(
    persist(
        immer((set) => ({
            ...initialState,
            saveExpense: (item: Group) => {
                item.id = UUID.generateId();
                item.createdAt = Date.now().toLocaleString('en');
                item.updatedAt = Date.now().toLocaleString('en');

                set((state) => ({ groupList: [...state.groupList, item] }));
            }
        })),
        storageOptions
    )
);

export default useGroupStore;