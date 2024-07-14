import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import ionicStorage from "../../storage/ionic.storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UUID } from "../../utils/person.utils";
import { Group } from "../../models";
import { parseDate } from "../../utils";
import useExpenseStore from "../expense/expense.store";

type GroupState = {
    current: Group | null,
    groupList: Group[]
};

type GroupActions = {
    saveGroup: (item: Group) => any,
    updateGroup: (item: Group, id: any) => any,
    removeGroup: (item: Group) => any,
    setGroup: (item: Group) => any,
    resetCurrentGroup: () => any,
};

const initialState: GroupState = {
    current: null,
    groupList: [],
};

const persistStorage: StateStorage = ionicStorage;

const storageOptions = {
    name: 'group.store',
    storage: createJSONStorage(() => persistStorage),
    partialize: (state: GroupState & GroupActions) => ({
        groupList: state.groupList,
        current: state.current
    })
}

const useGroupStore = create<GroupState & GroupActions>()(
    persist(
        immer((set) => ({
            ...initialState,
            saveGroup: (item: Group) => {
                item.id = UUID.generateId();
                item.createdAt = parseDate().format('YYYY-MM-DD');
                item.updatedAt = parseDate().format('YYYY-MM-DD');

                set((state) => ({ groupList: [...state.groupList, item] }));
            },
            updateGroup: (item: Group, id: any) => {
                set((state) => ({
                    groupList: state.groupList.map(group => {
                        if (group.id === id) {
                            return item;
                        }

                        return group;
                    })
                }));

            },
            removeGroup: (item: Group) => {
                set((state) => ({ groupList: state.groupList.filter(group => group.id !== item.id) }));
                const expenseStore = useExpenseStore.getState();
                const list = expenseStore.getExpenses(item);
                console.log('[removeGroup] list', list);

                expenseStore.removeExpenses(list);
            },
            setGroup: (item: Group) => {
                set((state) => ({ current: item }));
            },
            resetCurrentGroup: () => {
                set((state) => ({ current: null }));
            }
        })),
        storageOptions
    )
);

export default useGroupStore;