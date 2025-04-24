import {PasswordEntryInterface} from "../../data/passwordEntry.interface";

export interface KanbanColumn {
    key: string;
    entries: PasswordEntryInterface[];
}