import { Person } from "./person.model";

export interface Expense {
    type: string;
    title: string;
    amount: number;
    contributors?: Person[];
    transaction_id: any;
    payer_id?: any;
}