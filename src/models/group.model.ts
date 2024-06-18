import { BaseModel } from "./base.model";
import { Expense } from "./expense.model";

export interface Group extends BaseModel {
    name: string,
    expenses: Expense[]
}