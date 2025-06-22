import {Component, EnvironmentInjector, inject} from '@angular/core';
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {InputComponent} from "../../../../components/inputs/input/input.component";
import {ThemeColors} from "../../../../../shared/const/colors/general/themeColors";
import {SolidButtonComponent} from "../../../../components/buttons/solid-button/solid-button.component";
import {UserDataService} from "../../../../../services/user/user-data.service";
import {ProfileService} from "../../../../../services/routes/profile/profile.service";
import {ProfileLocalService} from "../../../../../services/profile/profile-local.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ConfirmModalService} from "../../../../../services/modals/confirm-modal.service";
import {ModalsConfig} from "../../../../../shared/const/components/modals/modals.config";
import {ToastService} from "../../../../../services/notification/toast.service";
import {WindowService} from "../../../../../services/window.service";

@Component({
  selector: 'app-account-tab-content',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    SolidButtonComponent,
      HttpClientModule
  ],
  templateUrl: './account-tab-content.component.html',
  styleUrl: './account-tab-content.component.css'
})
export class AccountTabContentComponent {
  userData = {
    username: UserDataService.getUsername(),
    email: '',
    fingerprint: UserDataService.getFingerprint()
  }

  colorData = {
    colorIcon: ThemeColors.GradientDarkPurple,
    colorFingerprint: ThemeColors.DarkOrange,
    colorDangerZone: ThemeColors.DarkRed
  }

  constructor(private http: HttpClient) {
  }

  private profileService = new ProfileService(this.http);
  private profileLocalService = new ProfileLocalService(this.profileService);
  private injector = inject(EnvironmentInjector);

  async ngOnInit(){
    this.userData.email = (await this.profileLocalService.getProfile())?.email || '';
  }

  async deleteProfile(){
    const result = await ConfirmModalService.createConfirmModal(
        this.injector,
        ModalsConfig.ConfirmModal.deleteProfile.title,
        ModalsConfig.ConfirmModal.deleteProfile.description,
        {requirePassword: true}
    );

    if (!result) {
      return;
    }

    await this.profileLocalService.deleteProfile();
    ToastService.success('Ваш аккаунт был удалён! Приложение будет перезапущено!');
    setTimeout(() => {
      WindowService.restartApp();
    }, 1500)
  }

  async deleteData(){
    const result = await ConfirmModalService.createConfirmModal(
        this.injector,
        ModalsConfig.ConfirmModal.deleteData.title,
        ModalsConfig.ConfirmModal.deleteData.description,
        {requirePassword: true}
    );

    if (!result) {
      return;
    }
    await this.profileLocalService.deleteData();
    await WindowService.restartApp();
  }

  protected readonly ThemeColors = ThemeColors;
}
