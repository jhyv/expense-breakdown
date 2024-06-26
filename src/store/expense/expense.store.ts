import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { Expense, Person } from "../../models";
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
    removeExpense: (expense: Expense) => any;
    updateExpense: (expense: Expense, id: any) => any;
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

const getBreakdown = (exp: Expense) => {
    if (exp.payer_id !== 'all') {
        const contribution = parseFloat(exp.amount.toString()) / (exp.contributors.length + 1);

        return exp.contributors.map((item: Person) => ({
            ...item,
            contribution
        }));
    } else {
        const contribution = parseFloat(exp.amount.toString()) / (exp.contributors.length);

        return exp.contributors.map((item: Person) => ({
            ...item,
            contribution
        }));
    }
}

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
                    contributors: getBreakdown(expense)
                };


                set((state) => ({ expenseList: [...state.expenseList, item] }));
            },
            removeExpense: (expense: Expense) => {
                set((state) => ({ expenseList: state.expenseList.filter(ex => ex.id !== expense.id) }));
            },
            updateExpense: (expense: Expense, id: any) => {
                set((state) => ({
                    expenseList: state.expenseList.map(ex => {
                        if (ex.id === expense.id) {
                            return {
                                ...expense,
                                updatedAt: Date.now().toLocaleString('en'),
                                contributors: getBreakdown(expense)
                            };
                        }

                        return ex
                    })
                }));
            },
        })),
        storageOptions
    )
);

export default useExpenseStore;
