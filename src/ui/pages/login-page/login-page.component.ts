import { Component } from '@angular/core';
import {LoginSteps, LoginStepsId} from "../../../shared/const/steps/login.steps";
import {StepComponent} from "../../components/steps/step/step.component";
import {NgComponentOutlet, NgIf} from "@angular/common";
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    StepComponent,
    NgComponentOutlet,
    NgIf,
    HeaderDescriptionComponent,
    InputComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  currentStepId: string = LoginSteps[0].contentId; // Начальный шаг
  loginUserData: LoginUserData = {
    email: '',
    confirmEmailCode: '',
    masterPassword: '',
    confirmMasterPassword: '',
    hintPassword: ''
  };

  // Обрабатываем изменение шага
  onStepChanged(stepId: string) {
    this.currentStepId = stepId; // Обновляем текущий шаг
  }

  onEmailChange(email: string){
    this.loginUserData.email = email;
  }

  onConfirmEmailCodeChange(code: string){
    this.loginUserData.confirmEmailCode = code;
  }

  onPasswordChange(password: string){
    this.loginUserData.masterPassword = password;
  }

  onConfirmPasswordChange(confirmPassword: string){
    this.loginUserData.confirmMasterPassword = confirmPassword;
  }

  onHintChange(hint: string){
    this.loginUserData.hintPassword = hint;
  }


  protected readonly LoginSteps = LoginSteps;
  protected readonly LoginStepsId = LoginStepsId;
  protected readonly ThemeColors = ThemeColors;
}
