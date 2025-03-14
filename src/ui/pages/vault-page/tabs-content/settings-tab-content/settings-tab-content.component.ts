import { Component } from '@angular/core';
import {SettingsService} from "../../../../../services/settings/app-settings.service";
import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
import {NgIf} from "@angular/common";
import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";

@Component({
  selector: 'app-settings-tab-content',
  standalone: true,
  imports: [
    ChipsComponent,
    NgIf
  ],
  templateUrl: './settings-tab-content.component.html',
  styleUrl: './settings-tab-content.component.css'
})
export class SettingsTabContentComponent {
  appSettings: AppSettings = SettingsService.getAllSettings();
  settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
  selectedCategory: string = SETTINGS_MODES.GENERAL.label;

  updateLockTimeout(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    SettingsService.setLockTimeout(value);
    this.appSettings.security.lockTimeout = value;
  }

  toggleHidePasswords(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    SettingsService.setHidePasswords(value);
    this.appSettings.security.hidePasswords = value;
  }

  toggleTwoFactorEnabled(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    SettingsService.setTwoFactorEnabled(value);
    this.appSettings.security.twoFactorEnabled = value;
  }

  toggleHighContrastMode(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    SettingsService.setHighContrastMode(value);
    this.appSettings.general.highContrastMode = value;
  }

  toggleHideFlowerStrengthWidget(event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    SettingsService.setHideFlowerStrengthWidget(value);
    this.appSettings.general.hideFlowerStrengthWidget = value;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  protected readonly SETTINGS_MODES = SETTINGS_MODES;
}
