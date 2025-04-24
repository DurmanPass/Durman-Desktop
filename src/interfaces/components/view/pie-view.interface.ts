import {PasswordEntryInterface} from "../../data/passwordEntry.interface";

export interface PieChartData {
    key: string;
    value: number;
    entries: PasswordEntryInterface[];
    color: string;
}