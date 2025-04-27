import { Component } from '@angular/core';
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {ButtonSizes} from "../../../shared/const/components/sizes/buttonsSizes";
import {ButtonsColors} from "../../../shared/const/colors/buttons/buttonsColors";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {setRandomAnimation} from "../../../utils/animations/logo-animations.utils";
import {SocialLinks} from "../../../shared/const/inks/social.links";
import {StepComponent} from "../../components/steps/step/step.component";
import {LoginSteps, LoginStepsId} from "../../../shared/const/steps/login.steps";
import {AuthModes} from "../../../shared/enums/modes/auth-modes.enum";
import {LoginPageComponent} from "../login-page/login-page.component";
import {RegisterPageComponent} from "../register-page/register-page.component";
import {AppVersionComponent} from "../../components/version/app-version/app-version.component";

@Component({
  selector: 'app-start-page',
  standalone: true,
    imports: [
        SolidButtonComponent,
        NgOptimizedImage,
        NgStyle,
        StepComponent,
        NgIf,
        LoginPageComponent,
        RegisterPageComponent,
        AppVersionComponent
    ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {
  logoAnimation: string = '';
  mode: string = AuthModes.START;

  ngOnInit(){
    deleteOverflowWindow();
    this.logoAnimation = setRandomAnimation();
  }

  onCreateAccountPage(){
    this.mode = AuthModes.REGISTER
  }

  onLoginAccountPage(){
    this.mode = AuthModes.LOGIN;
  }

  changeMode(mode: AuthModes){
    this.mode = mode;
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly SocialLinks = SocialLinks;
  protected readonly LoginSteps = LoginSteps;
  protected readonly LoginStepsId = LoginStepsId;
  protected readonly AuthModes = AuthModes;
}
