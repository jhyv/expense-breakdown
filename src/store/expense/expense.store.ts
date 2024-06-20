import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { Expense } from "../../models";
import ionicStorage from "../../storage/ionic.storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UUID } from "../../utils/person.utils";

type ExpenseState = {
    expenseList: Expense[]
};

type ExpenseActions = {
    setExpenses: (expenses: Expense[]) => any;
    addExpense: (expense: Expense) => any;
};

const initialState = {
    expenseList: []
};

const persistStorage: StateStorage = ionicStorage;

const storageOptions = {
    name: 'expense.store',
    storage: createJSONStorage(() => persistStorage),
    partialize: (state: ExpenseState & ExpenseActions) => ({
        expenseList: state.expenseList
    })
};

const useExpenseStore = create<ExpenseState & ExpenseActions>()(
    persist(
        immer((set) => ({
            ...initialState,
            setExpenses: (expenses: Expense[]) => {
                set({ expenseList: expenses });
            },
            addExpense: (expense: Expense) => {
                const item: Expense = {
                    ...expense,
                    id: UUID.generateId(),
                    createdAt: Date.now().toLocaleString('en'),
                    updatedAt: Date.now().toLocaleString('en'),
                };


                set((state) => ({ expenseList: [...state.expenseList, item] }));
            }
        })),
        storageOptions
    )
);

export default useExpenseStore;
