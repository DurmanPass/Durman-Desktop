import { Component } from '@angular/core';
import {
    FlowerStrengthWidgetComponent
} from "../../../../components/widgets/flower-strength-widget/flower-strength-widget.component";
import {WidgetBaseComponent} from "../../../../components/widgets/widget-base/widget-base.component";
import {getRandomPasswordText} from "../../../../../shared/const/components/widgets/create-password.widget";

@Component({
  selector: 'app-home-tab-content',
  standalone: true,
    imports: [
        FlowerStrengthWidgetComponent,
        WidgetBaseComponent
    ],
  templateUrl: './home-tab-content.component.html',
  styleUrl: './home-tab-content.component.css'
})
export class HomeTabContentComponent {
    securityLevel: number = 74;
    protected readonly getRandomPasswordText = getRandomPasswordText;
}