import { STORAGE_KEYS } from "../constants";
import { Person } from "../models";
import { BaseStorage } from "./base.storage";

export class PersonStorage extends BaseStorage<Person> {

    protected tableName: string = STORAGE_KEYS.PERSON_LIST;
}