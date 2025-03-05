import {VIEW_MANAGER_MODES} from "../../shared/enums/modes/view-manager.enum";

export interface PasswordManagerStateInterface {
    viewMode: VIEW_MANAGER_MODES;
    searchQuery: string;
    sortCriterion: 'name' | 'createdAt' | 'updatedAt' | 'usageCount';
    sortOrder: 'asc' | 'desc';
}