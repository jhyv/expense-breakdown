import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { Expense, Group, Person } from "../../models";
import ionicStorage from "../../storage/ionic.storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UUID } from "../../utils/person.utils";
import { parseDate } from "../../utils";

type ExpenseState = {
    expenseList: Expense[]
};

type ExpenseActions = {
    getExpenses: (group?: Group) => any;
    setExpenses: (expenses: Expense[]) => any;
    addExpense: (expense: Expense) => any;
    removeExpense: (expense: Expense) => any;
    updateExpense: (expense: Expense, id: any) => any;
    removeExpenses: (expenses: Expense[]) => any;
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
    if (exp?.excludePayer) {
        const contribution = parseFloat(exp.amount.toString()) / (exp.contributors.length);

        return exp.contributors.map((item: Person) => ({
            ...item,
            contribution
        }));
    } else {
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
}

const useExpenseStore = create<ExpenseState & ExpenseActions>()(
    persist(
        immer((set, get) => ({
            ...initialState,
            getExpenses: (group?: Group) => {
                if (group)
                    return get().expenseList.filter((exp) => exp.transaction_id === group.id);

                return get().expenseList;
            },
            setExpenses: (expenses: Expense[]) => {
                set({ expenseList: expenses });
            },
            addExpense: (expense: Expense) => {
                const item: Expense = {
                    ...expense,
                    id: UUID.generateId(),
                    createdAt: parseDate().format('YYYY-MM-DD'),
                    updatedAt: parseDate().format('YYYY-MM-DD'),
                    contributors: getBreakdown(expense)
                };


                set((state) => ({ expenseList: [...state.expenseList, item] }));
            },
            removeExpense: (expense: Expense) => {
                set((state) => ({ expenseList: state.expenseList.filter(ex => ex.id !== expense?.id) }));
            },
            removeExpenses: (expenses: Expense[]) => {
                const ids = expenses.map((item) => item.id);
                set((state) => ({ expenseList: state.expenseList.filter(ex => !ids.includes(ex.id)) }));
            },
            updateExpense: (expense: Expense, id: any) => {
                set((state) => ({
                    expenseList: state.expenseList.map(ex => {
                        if (ex.id === expense.id) {
                            return {
                                ...expense,
                                updatedAt: parseDate().format('YYYY-MM-DD'),
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
