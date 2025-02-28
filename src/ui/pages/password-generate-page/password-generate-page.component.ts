import { Component } from '@angular/core';
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {copyToClipboard} from "../../../utils/clipboard.utils";
import {CheckboxComponent} from "../../components/controls/checkbox/checkbox.component";
import {PasswordGenerator} from "../../../services/password/password-generate.service";

@Component({
  selector: 'app-password-generate-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    SolidButtonComponent,
    CheckboxComponent
  ],
  templateUrl: './password-generate-page.component.html',
  styleUrl: './password-generate-page.component.css'
})
export class PasswordGeneratePageComponent {
  password: string = '';
  lengthPassword: number = 12;
  generateOptions = {
    useUpperLetters: true,
    useLowerLetters: true,
    useNumbers: true,
    useSpecialSymbols: false,
    minNumbers: 1,
    minSymbols: 0
  }
  private passwordGenerator = new PasswordGenerator();

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

  ngOnInit(){
    deleteOverflowWindow();
  }

  generate() {
    this.password = this.passwordGenerator.generatePassword(this.lengthPassword, this.generateOptions);
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly copyToClipboard = copyToClipboard;
}
