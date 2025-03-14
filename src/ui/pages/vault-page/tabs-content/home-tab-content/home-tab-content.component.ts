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
import {ThemeColors} from "../../../../../shared/const/colors/general/themeColors";
import {PasswordInfo} from "../../../../../interfaces/data/passwordsInfo.interface";
import {WindowService} from "../../../../../services/window.service";
import {SettingsService} from "../../../../../services/settings/app-settings.service";

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
    securityLevel: number = 74;
    userEmail: string = "fsgasgdf@gmail.com";
    greeting = getRandomGreetingHomeTab(this.userEmail);
    newPasswordActionInfo = {
        title: getRandomPasswordText().title,
        description: getRandomPasswordText().description
    }

    passwordsInfo: PasswordInfo[] = [
        {
            id: 'all',
            score: 256,
            color: "DarkGreen"
        },
        {
            id: 'compromised',
            score: 16,
            color: "DarkRed"
        },
        {
            id: 'weak',
            score: 36,
            color: "DarkOrange"
        },
        {
            id: 'reused',
            score: 91,
            color: "Grey"
        },
    ];

    // Получение score по индексу
    getScoreByIndex(index: number): number {
        return this.passwordsInfo[index].score;
    }

    protected readonly getRandomPasswordText = getRandomPasswordText;
    protected readonly PasswordsInfoWidgets = PasswordsInfoWidgets;
    protected readonly WindowService = WindowService;
    protected readonly SettingsService = SettingsService;
}