import {VIEW_MANAGER_MODES} from "../../shared/enums/modes/view-manager.enum";
import {SORT_ORDER_ENTRY, SORT_PASSWORD_ENTRY} from "../../shared/enums/modes/sort-password-entry.enum";

export interface PasswordManagerStateInterface {
    viewMode: VIEW_MANAGER_MODES;
    searchQuery: string;
    sortCriterion: SORT_PASSWORD_ENTRY
    sortOrder: SORT_ORDER_ENTRY;
}