import { Component } from '@angular/core';
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {copyToClipboard} from "../../../utils/clipboard.utils";
import {CheckboxComponent} from "../../components/controls/checkbox/checkbox.component";
import {PasswordGenerator} from "../../../services/password/password-generate.service";
import {
  PasswordStrengthBarComponent
} from "../../components/bars/password-strength-bar/password-strength-bar.component";
import {NgIf} from "@angular/common";
import {PasswordStrengthService} from "../../../services/password/password-strength.service";
import {ToastService} from "../../../services/notification/toast.service";
import {SettingsService} from "../../../services/settings/app-settings.service";

@Component({
  selector: 'app-password-generate-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    SolidButtonComponent,
    CheckboxComponent,
    PasswordStrengthBarComponent,
    NgIf
  ],
  templateUrl: './password-generate-page.component.html',
  styleUrl: './password-generate-page.component.css'
})
export class PasswordGeneratePageComponent {
  password: string = '';
  passwordStrength: number = 0;
  lengthPassword: number = 12;
  minLengthPassword: number = 8;
  maxLengthPassword: number = 128;
  maxCountNumbersAndSymbols: number = 50;
  generateOptions = {
    useUpperLetters: true,
    useLowerLetters: true,
    useNumbers: true,
    useSpecialSymbols: false,
    minNumbers: 1,
    minSymbols: 0
  }
  private passwordGenerator = new PasswordGenerator();
  private passwordStrengthService = new PasswordStrengthService();

  onPasswordChange(value: string){
    this.onStrengthChange(value);
  }

  onCheckboxUpperChange(value: boolean) {
    this.generateOptions.useUpperLetters = value;
  }

  onCheckboxLowerChange(value: boolean) {
    this.generateOptions.useLowerLetters = value;
  }

  onCheckboxNumbersChange(value: boolean) {
    this.generateOptions.useNumbers = value;
  }

  onCheckboxSymbolsChange(value: boolean) {
    this.generateOptions.useSpecialSymbols = value;
  }

  onInputLengthChange(value: string){
    this.lengthPassword = Number(value);
  }

  onInputMinNumbersChange(value: string){
    this.generateOptions.minNumbers = Number(value);
  }

  onInputMinSymbolsChange(value: string){
    this.generateOptions.minSymbols = Number(value);
  }

  onStrengthChange(value: string){
    this.passwordStrength = Number(this.passwordStrengthService.getPasswordScore(value));
  }

  ngOnInit(){
    deleteOverflowWindow();
  }

  copyPasswordToClipboard(){
    ToastService.success('Пароль скопирован в буфер обмена!');
    copyToClipboard(this.password, SettingsService.getClearBuffer(), SettingsService.getClearBufferTimeout());
  }

  generate() {
    this.password = this.passwordGenerator.generatePassword(this.lengthPassword, this.generateOptions);
    this.onPasswordChange(this.password);
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly copyToClipboard = copyToClipboard;
}
