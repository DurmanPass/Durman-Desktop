import {Component, EventEmitter, Output} from '@angular/core';
import {LoginSteps, LoginStepsId} from "../../../shared/const/steps/login.steps";
import {StepComponent} from "../../components/steps/step/step.component";
import {NgComponentOutlet, NgIf} from "@angular/common";
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {RoundButtonComponent} from "../../components/buttons/round-button/round-button.component";
import {AuthModes} from "../../../shared/enums/modes/auth-modes.enum";
import {StepValidation} from "../../../interfaces/components/steps/stepValidation.interface";
import {ValidateService} from "../../../services/validate.service";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    StepComponent,
    NgComponentOutlet,
    NgIf,
    HeaderDescriptionComponent,
    InputComponent,
    RoundButtonComponent,
    SolidButtonComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  @Output() changeMode = new EventEmitter<AuthModes>();
  currentStepId: string = LoginSteps[0].contentId; // Начальный шаг
  loginUserData = {
    email: '',
    masterPassword: ''
  };

  validateLoginData = {
    isEmailValid: false,
    isPasswordValid: false
  }

  onEmailChange(email: string){
    this.loginUserData.email = email;
    ValidateService.validateEmail(this.loginUserData.email) ? this.validateLoginData.isEmailValid = true : this.validateLoginData.isEmailValid = false;
  }

  onPasswordChange(password: string){
    this.loginUserData.masterPassword = password;
    ValidateService.validatePassword(this.loginUserData.masterPassword).isValid ? this.validateLoginData.isPasswordValid = true : this.validateLoginData.isPasswordValid = false;
  }

  backToStartPage(){
    this.changeMode.emit(AuthModes.START);
  }

  protected readonly ThemeColors = ThemeColors;
}
