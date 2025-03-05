import {Component} from '@angular/core';
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {PasswordManagerStateInterface} from "../../../../../interfaces/data/passwordManagerState.interface";
import {VIEW_MANAGER_MODES} from "../../../../../shared/enums/modes/view-manager.enum";
import {SORT_ORDER_ENTRY, SORT_PASSWORD_ENTRY} from "../../../../../shared/enums/modes/sort-password-entry.enum";
import {NgForOf, NgIf} from "@angular/common";
import {ThemeColors} from "../../../../../shared/const/colors/general/themeColors";
import {PasswordEntryInterface} from "../../../../../interfaces/data/passwordEntry.interface";
import {PasswordManagerService} from "../../../../../services/password/password-manager.service";
import {PasswordManagerStats} from "../../../../../interfaces/data/passwordManagerStats";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {copyToClipboard} from "../../../../../utils/clipboard.utils";

@Component({
  selector: 'app-password-tab-content',
  standalone: true,
  imports: [
    InputComponent,
    NgIf,
    NgForOf,
    SolidButtonComponent
  ],
  templateUrl: './password-tab-content.component.html',
  styleUrl: './password-tab-content.component.css'
})
export class PasswordTabContentComponent {
  protected PasswordManagerState: PasswordManagerStateInterface = {
    viewMode: VIEW_MANAGER_MODES.TABLE,
    searchQuery: '',
    sortCriterion: SORT_PASSWORD_ENTRY.CREATED_AT,
    sortOrder: SORT_ORDER_ENTRY.ASC
  };


  filteredEntries: PasswordEntryInterface[] = [];
  stats: PasswordManagerStats = { total: 0, favorites: 0, weak: 0, frequent: 0 };

  ngOnInit(): void {
    this.updateEntries();
    this.updateStats();
  }

  toggleViewMode(): void {
    this.PasswordManagerState.viewMode =
        this.PasswordManagerState.viewMode === VIEW_MANAGER_MODES.TABLE
            ? VIEW_MANAGER_MODES.CARD
            : VIEW_MANAGER_MODES.TABLE;
  }

  private updateEntries(): void {
    let entries = PasswordManagerService.getEntriesSortedBy(this.PasswordManagerState.sortCriterion, this.PasswordManagerState.sortOrder);

    if (this.PasswordManagerState.searchQuery) {
      entries = entries.filter(entry =>
          entry.name.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase()) ||
          entry.metadata.category.toLowerCase().includes(this.PasswordManagerState.searchQuery.toLowerCase())
      );
    }

    this.filteredEntries = entries;
  }

  private updateStats(): void {
    const entries = PasswordManagerService.getAllEntries();
    this.stats = {
      total: entries.length,
      favorites: entries.filter(e => e.security.isFavorite).length,
      weak: entries.filter(e => e.credentials.passwordStrength < 3).length,
      frequent: entries.filter(e => e.metadata.usageCount > 5).length
    };
  }

  addEntry(): void {
    console.log('Открыть форму добавления записи');
    // Здесь можно открыть модальное окно для добавления
  }

  editEntry(id: string): void {
    console.log(`Редактировать запись с ID: ${id}`);
    // Здесь можно открыть модальное окно для редактирования
  }

  copyEntry(id: string): void {
    const entry = PasswordManagerService.getEntryById(id);
    if (entry && entry.credentials.password) {
      copyToClipboard(entry.credentials.password);
    }
  }

  deleteEntry(id: string): void {
    PasswordManagerService.removeEntry(id);
    this.updateEntries();
    this.updateStats();
  }

  protected readonly VIEW_MANAGER_MODES = VIEW_MANAGER_MODES;
  protected readonly ThemeColors = ThemeColors;
}
