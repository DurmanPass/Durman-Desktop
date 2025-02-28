import { Component } from '@angular/core';
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";

@Component({
  selector: 'app-password-generate-page',
  standalone: true,
  imports: [],
  templateUrl: './password-generate-page.component.html',
  styleUrl: './password-generate-page.component.css'
})
export class PasswordGeneratePageComponent {
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
}
