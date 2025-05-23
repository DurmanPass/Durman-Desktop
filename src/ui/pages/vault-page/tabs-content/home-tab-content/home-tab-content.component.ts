import { Component } from '@angular/core';
import {
    FlowerStrengthWidgetComponent
} from "../../../../components/widgets/flower-strength-widget/flower-strength-widget.component";
import {WidgetBaseComponent} from "../../../../components/widgets/widget-base/widget-base.component";
import {getRandomPasswordText} from "../../../../../shared/const/components/widgets/create-password.widget";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {getRandomGreetingHomeTab} from "../../../../../shared/const/components/text/greeting.home-tab";
import {NgForOf, NgIf} from "@angular/common";
import {PasswordsInfoWidgets} from "../../../../../shared/const/components/widgets/passwords-info.widget";
import {PasswordInfo} from "../../../../../interfaces/data/passwordsInfo.interface";
import {WindowService} from "../../../../../services/window.service";
import {SettingsLocalService} from "../../../../../services/settings/app-settings.service";
import {PasswordStrengthService} from "../../../../../services/password/password-strength.service";
import {UserDataService} from "../../../../../services/user/user-data.service";
import {PasswordService} from "../../../../../services/routes/password/password.service";
import {PasswordManagerService} from "../../../../../services/password/password-manager.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ProfileService} from "../../../../../services/routes/profile/profile.service";
import {ProfileLocalService} from "../../../../../services/profile/profile-local.service";
import {SettingsService} from "../../../../../services/routes/settings/settings.service";

@Component({
  selector: 'app-home-tab-content',
  standalone: true,
    imports: [
        FlowerStrengthWidgetComponent,
        WidgetBaseComponent,
        HeaderDescriptionComponent,
        NgForOf,
        NgIf,
        HttpClientModule
    ],
  templateUrl: './home-tab-content.component.html',
  styleUrl: './home-tab-content.component.css'
})
export class HomeTabContentComponent {
    private profileService = new ProfileService(this.http);
    private profileLocalService = new ProfileLocalService(this.profileService);

    securityLevel: number = 0;
    userEmail: string = '';
    greeting = getRandomGreetingHomeTab(this.userEmail);
    newPasswordActionInfo = {
        title: getRandomPasswordText().title,
        description: getRandomPasswordText().description
    }

    constructor(private http: HttpClient) {
    }

    protected passwordStrengthService = new PasswordStrengthService();
    protected serverPasswordService = new PasswordService(this.http);
    protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);

    protected settingsService = new SettingsService(this.http);
    protected settingsLocalService = new SettingsLocalService(this.settingsService);




    passwordsInfo: PasswordInfo[] = [
        { id: 'all', score: 0, color: "DarkGreen" },
        { id: 'weak', score: 0, color: "DarkOrange" },
        { id: 'reused', score: 0, color: "Grey" },
    ];

    private async updatePasswordInfo() {
        this.passwordsInfo = [
            {
                id: 'all',
                score: this.passwordStrengthService.getUniquePasswordsCount(),
                color: "DarkGreen"
            },
            {
                id: 'weak',
                score: this.passwordStrengthService.getWeakPasswordsCount(),
                color: "DarkOrange"
            },
            {
                id: 'reused',
                score: await this.passwordStrengthService.getReusedPasswordsCount(),
                color: "Grey"
            },
        ];
    }

    async ngOnInit() {
        this.userEmail = (await this.profileLocalService.getProfile())?.email || '';
        this.greeting = getRandomGreetingHomeTab(this.userEmail);
        await this.updatePasswordInfo();
        this.securityLevel = this.passwordStrengthService.getOverallPasswordStrengthPercentage();
    }

    // Получение score по индексу
    getScoreByIndex(index: number): number {
        return this.passwordsInfo[index].score;
    }

    protected readonly PasswordsInfoWidgets = PasswordsInfoWidgets;
    protected readonly WindowService = WindowService;
}