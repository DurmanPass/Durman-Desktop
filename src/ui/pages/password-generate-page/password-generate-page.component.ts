import { Component } from '@angular/core';
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {copyToClipboard} from "../../../utils/clipboard.utils";

@Component({
  selector: 'app-password-generate-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    SolidButtonComponent
  ],
  templateUrl: './password-generate-page.component.html',
  styleUrl: './password-generate-page.component.css'
})
export class PasswordGeneratePageComponent {
  password: string = 'мума';
  generateOptions = {
    useUpperLetters: true,
    useLowerLetters: true,
    useNumbers: true,
    useSpecialSymbols: false,
    minNumbers: 1,
    minSymbols: 0
  }

  ngOnInit(){
    deleteOverflowWindow();
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly copyToClipboard = copyToClipboard;
}
