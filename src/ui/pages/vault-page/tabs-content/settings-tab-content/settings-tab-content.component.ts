import { Component } from '@angular/core';
import {SettingsLocalService} from "../../../../../services/settings/app-settings.service";
import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
import {NgIf} from "@angular/common";
import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {CheckboxComponent} from "../../../../components/controls/checkbox/checkbox.component";
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {SecurityLockService} from "../../../../../services/security/security-lock.service";
import {SettingsService} from "../../../../../services/routes/settings/settings.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-settings-tab-content',
  standalone: true,
  imports: [
    ChipsComponent,
    NgIf,
    HeaderDescriptionComponent,
    CheckboxComponent,
    InputComponent,
    SolidButtonComponent,
      HttpClientModule
  ],
  templateUrl: './settings-tab-content.component.html',
  styleUrl: './settings-tab-content.component.css'
})
export class SettingsTabContentComponent {

  constructor(private http: HttpClient) {
  }

  protected settingsService = new SettingsService(this.http);
  protected settingsLocalService = new SettingsLocalService(this.settingsService);



  appSettings: AppSettings = this.settingsLocalService.getAllSettings();
  settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
  selectedCategory: string = SETTINGS_MODES.GENERAL.label;

  async ngOnInit(){
    await this.settingsLocalService.syncSettings();
    this.appSettings = await this.settingsLocalService.getSettings();
  }

  async updateLockTimeout(event: string) {
    const value = Number(event);
    await this.settingsLocalService.setLockTimeout(value);
    this.appSettings.security.lockTimeout = value;
  }

  async toggleHidePasswords(event: boolean) {
    await this.settingsLocalService.setHidePasswords(event);
    this.appSettings.security.hidePasswords = event;
  }

  async toggleClearBuffer(event: boolean) {
    await this.settingsLocalService.setClearBuffer(event);
    this.appSettings.security.buffer.clearBuffer = event;
  }

  async toggleTwoFactorEnabled(event: boolean) {
    await this.settingsLocalService.setTwoFactorEnabled(event);
    this.appSettings.security.twoFactorEnabled = event;
  }

  toggleHighContrastMode(event: boolean): void {
    this.settingsLocalService.setHighContrastMode(event);
    this.appSettings.general.highContrastMode = event;
  }

  async toggleHideFlowerStrengthWidget(event: boolean) {
    await this.settingsLocalService.setHideFlowerStrengthWidget(event);
    this.appSettings.general.hideFlowerStrengthWidget = event;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  protected readonly SETTINGS_MODES = SETTINGS_MODES;
  protected readonly SecurityLockService = SecurityLockService;
  protected readonly SettingsService = SettingsLocalService;
}
