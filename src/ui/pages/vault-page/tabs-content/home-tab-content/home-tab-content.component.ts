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
import {SettingsService} from "../../../../../services/settings/app-settings.service";
import {PasswordStrengthService} from "../../../../../services/password/password-strength.service";
import {UserDataService} from "../../../../../services/user/user-data.service";

@Component({
  selector: 'app-home-tab-content',
  standalone: true,
    imports: [
        FlowerStrengthWidgetComponent,
        WidgetBaseComponent,
        HeaderDescriptionComponent,
        NgForOf,
        NgIf
    ],
  templateUrl: './home-tab-content.component.html',
  styleUrl: './home-tab-content.component.css'
})
export class HomeTabContentComponent {
    securityLevel: number = 0;
    userEmail: string = UserDataService.getEmail();
    greeting = getRandomGreetingHomeTab(this.userEmail);
    newPasswordActionInfo = {
        title: getRandomPasswordText().title,
        description: getRandomPasswordText().description
    }

    protected passwordStrengthService = new PasswordStrengthService();


    passwordsInfo: PasswordInfo[] = [
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
            score: this.passwordStrengthService.getReusedPasswordsCount(),
            color: "Grey"
        },
    ];

    ngOnInit() {
        this.securityLevel = this.passwordStrengthService.getOverallPasswordStrengthPercentage();
    }

    // Получение score по индексу
    getScoreByIndex(index: number): number {
        return this.passwordsInfo[index].score;
    }

    protected readonly PasswordsInfoWidgets = PasswordsInfoWidgets;
    protected readonly WindowService = WindowService;
    protected readonly SettingsService = SettingsService;
}