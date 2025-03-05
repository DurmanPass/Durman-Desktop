import {Component} from '@angular/core';
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {PasswordManagerStateInterface} from "../../../../../interfaces/data/passwordManagerState.interface";
import {VIEW_MANAGER_MODES} from "../../../../../shared/enums/modes/view-manager.enum";

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
    sortCriterion: 'name',
    sortOrder: 'asc'
  };
}
