import { BaseModel } from "./base.model";
import { Person } from "./person.model";

export interface Expense extends BaseModel {
    type: string;
    title: string;
    amount: number;
    contributors: Person[];
    transaction_id: any;
    payer_id: any;
    payer?: Person;
}