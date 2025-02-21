import { Component } from '@angular/core';
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {NgIf} from "@angular/common";
import {StepComponent} from "../../components/steps/step/step.component";
import {RegisterSteps, RegisterStepsId} from "../../../shared/const/steps/register.steps";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    NgIf,
    StepComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  currentStepId: string = RegisterSteps[0].contentId; // Начальный шаг
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


  protected readonly RegisterSteps = RegisterSteps;
  protected readonly RegisterStepsId = RegisterStepsId;
  protected readonly ThemeColors = ThemeColors;
}
