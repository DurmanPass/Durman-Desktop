import { Component } from '@angular/core';
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {NgForOf, NgIf} from "@angular/common";
import {StepComponent} from "../../components/steps/step/step.component";
import {RegisterSteps, RegisterStepsId} from "../../../shared/const/steps/register.steps";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {PasswordStrengthService} from "../../../services/password/password-strength.service";
import {
  PasswordStrengthBarComponent
} from "../../components/bars/password-strength-bar/password-strength-bar.component";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    NgIf,
    StepComponent,
    NgForOf,
    PasswordStrengthBarComponent
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

  passwordStrength: number = 0;

  updateStrength(strength: number) {
    this.passwordStrength = strength;
    return strength;
  }

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
