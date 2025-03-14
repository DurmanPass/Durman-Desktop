import { Component } from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {ThemeColors} from "../../../../../shared/const/colors/general/themeColors";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {UserDataService} from "../../../../../services/user/user-data.service";

@Component({
  selector: 'app-account-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    SolidButtonComponent
  ],
  templateUrl: './account-tab-content.component.html',
  styleUrl: './account-tab-content.component.css'
})
export class AccountTabContentComponent {
  userData = {
    username: UserDataService.getUsername(),
    email: UserDataService.getEmail(),
    fingerprint: UserDataService.getFingerprint()
  }

  colorData = {
    colorIcon: ThemeColors.GradientDarkPurple,
    colorFingerprint: ThemeColors.DarkOrange,
    colorDangerZone: ThemeColors.DarkRed
  }
  protected readonly ThemeColors = ThemeColors;
}
