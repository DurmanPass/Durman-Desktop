import { Component } from '@angular/core';
import {LoginSteps, LoginStepsId} from "../../../shared/const/steps/login.steps";
import {StepComponent} from "../../components/steps/step/step.component";
import {NgComponentOutlet, NgIf} from "@angular/common";
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    StepComponent,
    NgComponentOutlet,
    NgIf
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
    confirmPassword: '',
    hintPassword: ''
  };

  // Обрабатываем изменение шага
  onStepChanged(stepId: string) {
    this.currentStepId = stepId; // Обновляем текущий шаг
  }

  protected readonly LoginSteps = LoginSteps;
  protected readonly LoginStepsId = LoginStepsId;
  protected readonly ThemeColors = ThemeColors;
}
