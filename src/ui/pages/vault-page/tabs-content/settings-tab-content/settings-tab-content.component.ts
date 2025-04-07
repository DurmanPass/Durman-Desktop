import { Component } from '@angular/core';
import {SettingsService} from "../../../../../services/settings/app-settings.service";
import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
import {NgIf} from "@angular/common";
import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {CheckboxComponent} from "../../../../components/controls/checkbox/checkbox.component";
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {SecurityLockService} from "../../../../../services/security/security-lock.service";

@Component({
  selector: 'app-settings-tab-content',
  standalone: true,
  imports: [
    ChipsComponent,
    NgIf,
    HeaderDescriptionComponent,
    CheckboxComponent,
    InputComponent,
    SolidButtonComponent
  ],
  templateUrl: './settings-tab-content.component.html',
  styleUrl: './settings-tab-content.component.css'
})
export class SettingsTabContentComponent {
  appSettings: AppSettings = SettingsService.getAllSettings();
  settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
  selectedCategory: string = SETTINGS_MODES.GENERAL.label;

  updateLockTimeout(event: string): void {
    const value = Number(event);
    SettingsService.setLockTimeout(value);
    this.appSettings.security.lockTimeout = value;
  }

  toggleHidePasswords(event: boolean): void {
    SettingsService.setHidePasswords(event);
    this.appSettings.security.hidePasswords = event;
  }

  toggleClearBuffer(event: boolean): void {
    SettingsService.setClearBuffer(event);
    this.appSettings.security.buffer.clearBuffer = event;
  }

  toggleTwoFactorEnabled(event: boolean): void {
    SettingsService.setTwoFactorEnabled(event);
    this.appSettings.security.twoFactorEnabled = event;
  }

  toggleHighContrastMode(event: boolean): void {
    SettingsService.setHighContrastMode(event);
    this.appSettings.general.highContrastMode = event;
  }

  toggleHideFlowerStrengthWidget(event: boolean): void {
    SettingsService.setHideFlowerStrengthWidget(event);
    this.appSettings.general.hideFlowerStrengthWidget = event;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  protected readonly SETTINGS_MODES = SETTINGS_MODES;
  protected readonly SecurityLockService = SecurityLockService;
  protected readonly SettingsService = SettingsService;
}
