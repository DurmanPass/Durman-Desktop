// // import { Component } from '@angular/core';
// // import {SettingsLocalService} from "../../../../../services/settings/app-settings.service";
// // import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
// // import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
// // import {NgIf} from "@angular/common";
// // import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";
// // import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
// // import {CheckboxComponent} from "../../../../components/controls/checkbox/checkbox.component";
// // import {InputComponent} from "../../../../components/inputs/input/input.component";
// // import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
// // import {SecurityLockService} from "../../../../../services/security/security-lock.service";
// // import {SettingsService} from "../../../../../services/routes/settings/settings.service";
// // import {HttpClient, HttpClientModule} from "@angular/common/http";
// // import {HintModes} from "../../../../../shared/enums/modes/hint.modes.enum";
// // import {TwoFAService} from "../../../../../services/routes/twoFA/twoFA.service";
// // import {TwoFaModes} from "../../../../../shared/enums/modes/twoFa.modes.enum";
// // import {Disable2FAResponse, Enable2FAResponse} from "../../../../../interfaces/data/twoFA.interface";
// //
// // @Component({
// //   selector: 'app-settings-tab-content',
// //   standalone: true,
// //   imports: [
// //     ChipsComponent,
// //     NgIf,
// //     HeaderDescriptionComponent,
// //     CheckboxComponent,
// //     InputComponent,
// //     SolidButtonComponent,
// //       HttpClientModule
// //   ],
// //   templateUrl: './settings-tab-content.component.html',
// //   styleUrl: './settings-tab-content.component.css'
// // })
// // export class SettingsTabContentComponent {
// //
// //   constructor(private http: HttpClient) {
// //   }
// //
// //   protected settingsService = new SettingsService(this.http);
// //   protected settingsLocalService = new SettingsLocalService(this.settingsService);
// //   protected twoFaService = new TwoFAService(this.http);
// //
// //   twoFa = {
// //     mode: TwoFaModes.NONE,
// //     code: '',
// //   }
// //
// //   twoFaResponse: Disable2FAResponse | Enable2FAResponse = {
// //     message: '',
// //     uuid: ''
// //   }
// //
// //
// //   appSettings: AppSettings = this.settingsLocalService.getAllSettings();
// //   settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
// //   selectedCategory: string = SETTINGS_MODES.GENERAL.label;
// //
// //   async ngOnInit(){
// //     await this.settingsLocalService.syncSettings();
// //     this.appSettings = await this.settingsLocalService.getSettings();
// //   }
// //
// //   async updateLockTimeout(event: string) {
// //     const value = Number(event);
// //     await this.settingsLocalService.setLockTimeout(value);
// //     this.appSettings.security.lockTimeout = value;
// //   }
// //
// //   async toggleHidePasswords(event: boolean) {
// //     await this.settingsLocalService.setHidePasswords(event);
// //     this.appSettings.security.hidePasswords = event;
// //   }
// //
// //   async toggleClearBuffer(event: boolean) {
// //     await this.settingsLocalService.setClearBuffer(event);
// //     this.appSettings.security.buffer.clearBuffer = event;
// //   }
// //
// //   toggleHighContrastMode(event: boolean): void {
// //     this.settingsLocalService.setHighContrastMode(event);
// //     this.appSettings.general.highContrastMode = event;
// //   }
// //
// //   async toggleHideFlowerStrengthWidget(event: boolean) {
// //     await this.settingsLocalService.setHideFlowerStrengthWidget(event);
// //     this.appSettings.general.hideFlowerStrengthWidget = event;
// //   }
// //
// //   onCategoryChange(category: string): void {
// //     this.selectedCategory = category;
// //   }
// //
// //   async toggleTwoFactorEnabled(event: boolean) {
// //     await this.settingsLocalService.setTwoFactorEnabled(event);
// //     this.appSettings.security.twoFactorEnabled = event;
// //   }
// //
// //   async enable2FA(){
// //     this.twoFaResponse = await this.twoFaService.enable2FA();
// //     this.twoFa.mode = TwoFaModes.ENABLE;
// //   }
// //
// //   async confirmEnable2FA(){
// //     await this.twoFaService.confirmEnable2FA(this.twoFaResponse.uuid, this.twoFa.code);
// //     await this.toggleTwoFactorEnabled(true);
// //     this.twoFa.mode = TwoFaModes.NONE;
// //   }
// //
// //   async disable2FA(){
// //     this.twoFaResponse = await this.twoFaService.disable2FA();
// //     this.twoFa.mode = TwoFaModes.DISABLE;
// //   }
// //
// //   async confirmDisable2FA(){
// //     await this.twoFaService.confirmDisable2FA(this.twoFaResponse.uuid, this.twoFa.code);
// //     await this.toggleTwoFactorEnabled(false);
// //     this.twoFa.mode = TwoFaModes.NONE;
// //   }
// //
// //   async onConfirm2FA(){
// //     if(this.twoFa.mode === TwoFaModes.ENABLE){
// //       await this.confirmEnable2FA();
// //       return;
// //     }
// //     await this.confirmDisable2FA();
// //   }
// //
// //   onTwoFaCodeChange(value: string){
// //     this.twoFa.code = value;
// //   }
// //
// //   protected readonly SETTINGS_MODES = SETTINGS_MODES;
// //   protected readonly SecurityLockService = SecurityLockService;
// //   protected readonly SettingsService = SettingsLocalService;
// //   protected readonly HintModes = HintModes;
// //   protected readonly TwoFaModes = TwoFaModes;
// // }
//
// import { Component } from '@angular/core';
// import {SettingsLocalService} from "../../../../../services/settings/app-settings.service";
// import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
// import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
// import {NgIf} from "@angular/common";
// import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";
// import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
// import {CheckboxComponent} from "../../../../components/controls/checkbox/checkbox.component";
// import {InputComponent} from "../../../../components/inputs/input/input.component";
// import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
// import {SecurityLockService} from "../../../../../services/security/security-lock.service";
// import {SettingsService} from "../../../../../services/routes/settings/settings.service";
// import {HttpClient, HttpClientModule} from "@angular/common/http";
// import {HintModes} from "../../../../../shared/enums/modes/hint.modes.enum";
// import {TwoFAService} from "../../../../../services/routes/twoFA/twoFA.service";
// import {TwoFaModes} from "../../../../../shared/enums/modes/twoFa.modes.enum";
// import {Disable2FAResponse, Enable2FAResponse} from "../../../../../interfaces/data/twoFA.interface";
//
// @Component({
//   selector: 'app-settings-tab-content',
//   standalone: true,
//   imports: [
//     ChipsComponent,
//     NgIf,
//     HeaderDescriptionComponent,
//     CheckboxComponent,
//     InputComponent,
//     SolidButtonComponent,
//     HttpClientModule
//   ],
//   templateUrl: './settings-tab-content.component.html',
//   styleUrl: './settings-tab-content.component.css'
// })
// export class SettingsTabContentComponent {
//
//   constructor(private http: HttpClient) {
//   }
//
//   protected settingsService = new SettingsService(this.http);
//   protected settingsLocalService = new SettingsLocalService(this.settingsService);
//   protected twoFaService = new TwoFAService(this.http);
//
//   twoFa = {
//     mode: TwoFaModes.NONE,
//     code: '',
//   }
//
//   twoFaResponse: Disable2FAResponse | Enable2FAResponse = {
//     message: '',
//     uuid: ''
//   }
//
//
//   appSettings: AppSettings = this.settingsLocalService.getAllSettings();
//   settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
//   selectedCategory: string = SETTINGS_MODES.GENERAL.label;
//
//   async ngOnInit(){
//     await this.settingsLocalService.syncSettings();
//     this.appSettings = await this.settingsLocalService.getSettings();
//   }
//
//   async updateLockTimeout(event: string) {
//     const value = Number(event);
//     await this.settingsLocalService.setLockTimeout(value);
//     this.appSettings.security.lockTimeout = value;
//   }
//
//   async toggleHidePasswords(event: boolean) {
//     await this.settingsLocalService.setHidePasswords(event);
//     this.appSettings.security.hidePasswords = event;
//   }
//
//   async toggleClearBuffer(event: boolean) {
//     await this.settingsLocalService.setClearBuffer(event);
//     this.appSettings.security.buffer.clearBuffer = event;
//   }
//
//
//
//
//
//
//   toggleHighContrastMode(event: boolean): void {
//     this.settingsLocalService.setHighContrastMode(event);
//     this.appSettings.general.highContrastMode = event;
//   }
//
//   async toggleHideFlowerStrengthWidget(event: boolean) {
//     await this.settingsLocalService.setHideFlowerStrengthWidget(event);
//     this.appSettings.general.hideFlowerStrengthWidget = event;
//   }
//
//   onCategoryChange(category: string): void {
//     this.selectedCategory = category;
//   }
//
//   async toggleTwoFactorEnabled(event: boolean) {
//     await this.settingsLocalService.setTwoFactorEnabled(event);
//     this.appSettings.security.twoFactorEnabled = event;
//   }
//
//   async enable2FA(){
//     this.twoFaResponse = await this.twoFaService.enable2FA();
//     this.twoFa.mode = TwoFaModes.ENABLE;
//   }
//
//   async confirmEnable2FA(){
//     await this.twoFaService.confirmEnable2FA(this.twoFaResponse.uuid, this.twoFa.code);
//     await this.toggleTwoFactorEnabled(true);
//     this.twoFa.mode = TwoFaModes.NONE;
//   }
//
//   async disable2FA(){
//     this.twoFaResponse = await this.twoFaService.disable2FA();
//     this.twoFa.mode = TwoFaModes.DISABLE;
//   }
//
//   async confirmDisable2FA(){
//     await this.twoFaService.confirmDisable2FA(this.twoFaResponse.uuid, this.twoFa.code);
//     await this.toggleTwoFactorEnabled(false);
//     this.twoFa.mode = TwoFaModes.NONE;
//   }
//
//   async onConfirm2FA(){
//     if(this.twoFa.mode === TwoFaModes.ENABLE){
//       await this.confirmEnable2FA();
//       return;
//     }
//     await this.confirmDisable2FA();
//   }
//
//   onTwoFaCodeChange(value: string){
//     this.twoFa.code = value;
//   }
//
//   protected readonly SETTINGS_MODES = SETTINGS_MODES;
//   protected readonly SecurityLockService = SecurityLockService;
//   protected readonly SettingsService = SettingsLocalService;
//   protected readonly HintModes = HintModes;
//   protected readonly TwoFaModes = TwoFaModes;
// }

// import { Component } from '@angular/core';
// import {SettingsLocalService} from "../../../../../services/settings/app-settings.service";
// import {AppSettings} from "../../../../../interfaces/data/appSettings.interface";
// import {ChipsComponent} from "../../../../components/controls/chips/chips.component";
// import {NgIf} from "@angular/common";
// import {SETTINGS_MODES} from "../../../../../shared/const/modes/settings.modes";
// import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
// import {CheckboxComponent} from "../../../../components/controls/checkbox/checkbox.component";
// import {InputComponent} from "../../../../components/inputs/input/input.component";
// import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
// import {SecurityLockService} from "../../../../../services/security/security-lock.service";
// import {SettingsService} from "../../../../../services/routes/settings/settings.service";
// import {HttpClient, HttpClientModule} from "@angular/common/http";
// import {HintModes} from "../../../../../shared/enums/modes/hint.modes.enum";
// import {TwoFAService} from "../../../../../services/routes/twoFA/twoFA.service";
// import {TwoFaModes} from "../../../../../shared/enums/modes/twoFa.modes.enum";
// import {Disable2FAResponse, Enable2FAResponse} from "../../../../../interfaces/data/twoFA.interface";
//
// @Component({
//   selector: 'app-settings-tab-content',
//   standalone: true,
//   imports: [
//     ChipsComponent,
//     NgIf,
//     HeaderDescriptionComponent,
//     CheckboxComponent,
//     InputComponent,
//     SolidButtonComponent,
//     HttpClientModule
//   ],
//   templateUrl: './settings-tab-content.component.html',
//   styleUrl: './settings-tab-content.component.css'
// })
// export class SettingsTabContentComponent {
//
//   constructor(private http: HttpClient) {
//   }
//
//   protected settingsService = new SettingsService(this.http);
//   protected settingsLocalService = new SettingsLocalService(this.settingsService);
//   protected twoFaService = new TwoFAService(this.http);
//
//   twoFa = {
//     mode: TwoFaModes.NONE,
//     code: '',
//   }
//
//   twoFaResponse: Disable2FAResponse | Enable2FAResponse = {
//     message: '',
//     uuid: ''
//   }
//
//
//   appSettings: AppSettings = this.settingsLocalService.getAllSettings();
//   settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
//   selectedCategory: string = SETTINGS_MODES.GENERAL.label;
//
//   async ngOnInit(){
//     await this.settingsLocalService.syncSettings();
//     this.appSettings = await this.settingsLocalService.getSettings();
//   }
//
//   async updateLockTimeout(event: string) {
//     const value = Number(event);
//     await this.settingsLocalService.setLockTimeout(value);
//     this.appSettings.security.lockTimeout = value;
//   }
//
//   async toggleHidePasswords(event: boolean) {
//     await this.settingsLocalService.setHidePasswords(event);
//     this.appSettings.security.hidePasswords = event;
//   }
//
//   async toggleClearBuffer(event: boolean) {
//     await this.settingsLocalService.setClearBuffer(event);
//     this.appSettings.security.buffer.clearBuffer = event;
//   }
//
//   toggleHighContrastMode(event: boolean): void {
//     this.settingsLocalService.setHighContrastMode(event);
//     this.appSettings.general.highContrastMode = event;
//   }
//
//   async toggleHideFlowerStrengthWidget(event: boolean) {
//     await this.settingsLocalService.setHideFlowerStrengthWidget(event);
//     this.appSettings.general.hideFlowerStrengthWidget = event;
//   }
//
//   onCategoryChange(category: string): void {
//     this.selectedCategory = category;
//   }
//
//   async toggleTwoFactorEnabled(event: boolean) {
//     await this.settingsLocalService.setTwoFactorEnabled(event);
//     this.appSettings.security.twoFactorEnabled = event;
//   }
//
//   async enable2FA(){
//     this.twoFaResponse = await this.twoFaService.enable2FA();
//     this.twoFa.mode = TwoFaModes.ENABLE;
//   }
//
//   async confirmEnable2FA(){
//     await this.twoFaService.confirmEnable2FA(this.twoFaResponse.uuid, this.twoFa.code);
//     await this.toggleTwoFactorEnabled(true);
//     this.twoFa.mode = TwoFaModes.NONE;
//   }
//
//   async disable2FA(){
//     this.twoFaResponse = await this.twoFaService.disable2FA();
//     this.twoFa.mode = TwoFaModes.DISABLE;
//   }
//
//   async confirmDisable2FA(){
//     await this.twoFaService.confirmDisable2FA(this.twoFaResponse.uuid, this.twoFa.code);
//     await this.toggleTwoFactorEnabled(false);
//     this.twoFa.mode = TwoFaModes.NONE;
//   }
//
//   async onConfirm2FA(){
//     if(this.twoFa.mode === TwoFaModes.ENABLE){
//       await this.confirmEnable2FA();
//       return;
//     }
//     await this.confirmDisable2FA();
//   }
//
//   onTwoFaCodeChange(value: string){
//     this.twoFa.code = value;
//   }
//
//   protected readonly SETTINGS_MODES = SETTINGS_MODES;
//   protected readonly SecurityLockService = SecurityLockService;
//   protected readonly SettingsService = SettingsLocalService;
//   protected readonly HintModes = HintModes;
//   protected readonly TwoFaModes = TwoFaModes;
//}

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
import {HintModes} from "../../../../../shared/enums/modes/hint.modes.enum";
import {TwoFAService} from "../../../../../services/routes/twoFA/twoFA.service";
import {TwoFaModes} from "../../../../../shared/enums/modes/twoFa.modes.enum";
import {Disable2FAResponse, Enable2FAResponse} from "../../../../../interfaces/data/twoFA.interface";
import {StoreService} from "../../../../../services/vault/store.service";
import {StoreKeys} from "../../../../../shared/const/vault/store.keys";

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
  protected twoFaService = new TwoFAService(this.http);

  twoFa = {
    mode: TwoFaModes.NONE,
    code: '',
  }

  twoFaResponse: Disable2FAResponse | Enable2FAResponse = {
    message: '',
    uuid: ''
  }


  appSettings: AppSettings = this.settingsLocalService.getAllSettings();
  settingCategories: string[] = [SETTINGS_MODES.GENERAL.label, SETTINGS_MODES.SECURITY.label];
  selectedCategory: string = SETTINGS_MODES.GENERAL.label;

  twoFaSka: boolean = false;

  async ngOnInit(){
    await this.settingsLocalService.syncSettings();
    this.appSettings = await this.settingsLocalService.getSettings();
    this.twoFaSka = await StoreService.get(StoreKeys.ENABLE_TWOFA) === 'true' ? true : false;
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

  async toggleTwoFactorEnabled(event: boolean) {
    await this.settingsLocalService.setTwoFactorEnabled(event);
    this.appSettings.security.twoFactorEnabled = event;
  }

  async enable2FA(){
    this.twoFaResponse = await this.twoFaService.enable2FA();
    this.twoFa.mode = TwoFaModes.ENABLE;
  }

  async confirmEnable2FA(){
    await this.twoFaService.confirmEnable2FA(this.twoFaResponse.uuid, this.twoFa.code);
    await this.toggleTwoFactorEnabled(true);
    this.twoFa.mode = TwoFaModes.NONE;
  }

  async disable2FA(){
    this.twoFaResponse = await this.twoFaService.disable2FA();
    this.twoFa.mode = TwoFaModes.DISABLE;
  }

  async confirmDisable2FA(){
    await this.twoFaService.confirmDisable2FA(this.twoFaResponse.uuid, this.twoFa.code);
    await this.toggleTwoFactorEnabled(false);
    this.twoFa.mode = TwoFaModes.NONE;
    this.twoFaSka = false;
    await StoreService.save(StoreKeys.ENABLE_TWOFA, 'false');
  }

  async onConfirm2FA(){
    if(this.twoFa.mode === TwoFaModes.ENABLE){
      await this.confirmEnable2FA();
      return;
    }
    await this.confirmDisable2FA();
  }

  onTwoFaCodeChange(value: string){
    this.twoFa.code = value;
  }

  protected readonly SETTINGS_MODES = SETTINGS_MODES;
  protected readonly SecurityLockService = SecurityLockService;
  protected readonly SettingsService = SettingsLocalService;
  protected readonly HintModes = HintModes;
  protected readonly TwoFaModes = TwoFaModes;
  protected readonly StoreService = StoreService;
}