import {Component, EventEmitter, Output} from '@angular/core';
import {LoginSteps} from "../../../shared/const/steps/login.steps";
import {StepComponent} from "../../components/steps/step/step.component";
import {NgComponentOutlet, NgIf} from "@angular/common";
import {ThemeColors} from "../../../shared/const/colors/general/themeColors";
import {HeaderDescriptionComponent} from "../../components/text/header-description/header-description.component";
import {InputComponent} from "../../components/inputs/input/input.component";
import {RoundButtonComponent} from "../../components/buttons/round-button/round-button.component";
import {AuthModes} from "../../../shared/enums/modes/auth-modes.enum";
import {ValidateService} from "../../../services/validate.service";
import {SolidButtonComponent} from "../../components/buttons/solid-button/solid-button.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {LoginService} from "../../../services/routes/auth/login.service";
import {ToastService} from "../../../services/notification/toast.service";
import {WindowService} from "../../../services/window.service";
import {TextLinkComponent} from "../../components/links/text-link/text-link.component";
import {HintService} from "../../../services/routes/hint/hint.service";
import {RequestHintResponse} from "../../../interfaces/data/hint.interface";
import {HintModes} from "../../../shared/enums/modes/hint.modes.enum";
import {LoginModes} from "../../../shared/enums/modes/login.modes.enum";
import {TwoFaPageComponent} from "../two-fa-page/two-fa-page.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    HttpClientModule,
    StepComponent,
    NgComponentOutlet,
    NgIf,
    HeaderDescriptionComponent,
    InputComponent,
    RoundButtonComponent,
    SolidButtonComponent,
    TextLinkComponent,
    TwoFaPageComponent
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

  hint = {
    code: '',
    mode: HintModes.NONE,
    value: ''
  }

  hintRequest: RequestHintResponse = {
    message: '',
    uuid: ''
  };

  mode: LoginModes = LoginModes.LOGIN;
  userID: string = '';

  private loginService = new LoginService(this.http)
  private hintService = new HintService(this.http);

  constructor(private http: HttpClient) {
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

  async onLogin() {
    if (this.validateLoginData.isEmailValid && this.validateLoginData.isPasswordValid) {
      const loginResponse = await this.loginService.login(this.loginUserData.email, this.loginUserData.masterPassword);
      if(loginResponse.userID && loginResponse.message === '2FA code sent to email'){
        this.userID = loginResponse.userID;
        this.mode = LoginModes.TWO_FA;
      }
    } else {
      ToastService.danger('Проверьте введённые данные!')
    }
  }

  onHintCodeChange(hintCode: string){
    this.hint.code = hintCode;
  }

  async onConfirmHintCode(uuid: string, code: string){
    const hint = await this.hintService.getHint(uuid, code);
    this.hint.value = hint.password_hint;
    this.hint.mode = HintModes.SHOW;
  }

  async getHint(){
    if(!this.validateLoginData.isEmailValid){
      ToastService.danger("Введите корректную электронную почту!");
    }
    this.hintRequest = await this.hintService.requestHint(this.loginUserData.email);
    this.hint.mode = HintModes.REQUEST;
  }

  protected readonly ThemeColors = ThemeColors;
    protected readonly WindowService = WindowService;
  protected readonly HintModes = HintModes;
  protected readonly LoginModes = LoginModes;
}
