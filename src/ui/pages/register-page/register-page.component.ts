import {Component, EventEmitter, Output} from '@angular/core';
import {LoginUserData} from "../../../interfaces/components/login/loginUserData.interface";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {NgForOf, NgIf} from "@angular/common";
import {StepComponent} from "../../components/steps/step/step.component";
import {RegisterSteps, RegisterStepsId} from "../../../shared/const/steps/register.steps";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {
  PasswordStrengthBarComponent
} from "../../components/bars/password-strength-bar/password-strength-bar.component";
import {ValidateService} from "../../../services/validate.service";
import {StepValidation} from "../../../interfaces/components/steps/stepValidation.interface";
import {RoundButtonComponent} from "../../components/buttons/round-button/round-button.component";
import {AuthModes} from "../../../shared/enums/modes/auth-modes.enum";
import {TextLinkComponent} from "../../components/links/text-link/text-link.component";
import {WindowService} from "../../../services/window.service";
import {PasswordStrengthService} from "../../../services/password/password-strength.service";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    NgIf,
    StepComponent,
    NgForOf,
    PasswordStrengthBarComponent,
    RoundButtonComponent,
    TextLinkComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  @Output() changeMode = new EventEmitter<AuthModes>();
  currentStepId: string = RegisterSteps[0].contentId;
  passwordStrength: number = 0;
  loginUserData: LoginUserData = {
    email: '',
    confirmEmailCode: '',
    masterPassword: '',
    confirmMasterPassword: '',
    hintPassword: ''
  };
  validateLoginData: StepValidation = {
    step_1: {
      isEmailValid: false
    },
    step_2: {
      isEmailCodeValid: false
    },
    step_3: {
      // isValid: false,
      // hasMinLength: false,
      // hasMaxLength: true,
      // hasUpperCase: false,
      // hasSpecialChar: false,
      isPasswordValid: false,
      isPasswordsMatch: false
    },
    step_4:{
      isPasswordHintValid: true
    },
  };

  inputLimits = {
    email: {
      maxLength: 200
    },
    emailCode: {
      maxLength: 5,
      max: 99999
    },
    password: {
      minLength: 8,
      maxLength: 128
    },
    hint: {
      maxLength: 16
    }
  }

  private passwordStrengthService = new PasswordStrengthService();

  onStrengthChange(value: string){
    this.passwordStrength = Number(this.passwordStrengthService.getPasswordScore(value));
  }

  // updateStrength(strength: number) {
  //   this.passwordStrength = strength;
  //   return strength;
  // }

  // Обрабатываем изменение шага
  onStepChanged(stepId: string) {
    this.currentStepId = stepId; // Обновляем текущий шаг
  }

  onEmailChange(email: string){
    this.loginUserData.email = email;
    ValidateService.validateEmail(this.loginUserData.email) ? this.validateLoginData['step_1']['isEmailValid'] = true : this.validateLoginData['step_1']['isEmailValid'] = false;
  }

  onConfirmEmailCodeChange(code: string){
    this.loginUserData.confirmEmailCode = code;
    ValidateService.validateEmailCode(this.loginUserData.confirmEmailCode) ? this.validateLoginData['step_2']['isEmailCodeValid'] = true : this.validateLoginData['step_2']['isEmailCodeValid'] = false;
  }

  onPasswordChange(password: string){
    this.loginUserData.masterPassword = password;
    this.onStrengthChange(password);
    ValidateService.validatePassword(this.loginUserData.masterPassword).isValid ? this.validateLoginData['step_3']['isPasswordValid'] = true : this.validateLoginData['step_3']['isPasswordValid'] = false;
  }

  onConfirmPasswordChange(confirmPassword: string){
    this.loginUserData.confirmMasterPassword = confirmPassword;
    this.loginUserData.masterPassword === this.loginUserData.confirmMasterPassword ? this.validateLoginData['step_3']['isPasswordsMatch'] = true : this.validateLoginData['step_3']['isPasswordsMatch'] = false
  }

  onHintChange(hint: string){
    this.loginUserData.hintPassword = hint;
    ValidateService.validatePasswordHint(this.loginUserData.hintPassword) ? this.validateLoginData['step_4']['isPasswordHintValid'] = true : this.validateLoginData['step_4']['isPasswordHintValid'] = false;
  }

  backToStartPage(){
    this.changeMode.emit(AuthModes.START);
  }


  protected readonly RegisterSteps = RegisterSteps;
  protected readonly RegisterStepsId = RegisterStepsId;
  protected readonly ThemeColors = ThemeColors;
  protected readonly WindowService = WindowService;
}
