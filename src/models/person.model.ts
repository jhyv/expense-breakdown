import { BaseModel } from "./base.model";

export interface Person extends BaseModel {
    name: string;
    gender?: string;
    thumbnail?: string;
}