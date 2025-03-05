import {Component} from '@angular/core';
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {PasswordManagerStateInterface} from "../../../../../interfaces/data/passwordManagerState.interface";
import {VIEW_MANAGER_MODES} from "../../../../../shared/enums/modes/view-manager.enum";
import {SORT_ORDER_ENTRY, SORT_PASSWORD_ENTRY} from "../../../../../shared/enums/modes/sort-password-entry.enum";

@Component({
  selector: 'app-password-tab-content',
  standalone: true,
  imports: [
    InputComponent
  ],
  templateUrl: './password-tab-content.component.html',
  styleUrl: './password-tab-content.component.css'
})
export class PasswordTabContentComponent {
  private PasswordManagerState: PasswordManagerStateInterface = {
    viewMode: VIEW_MANAGER_MODES.TABLE,
    searchQuery: '',
    sortCriterion: SORT_PASSWORD_ENTRY.CREATED_AT,
    sortOrder: SORT_ORDER_ENTRY.ASC
  };
}
