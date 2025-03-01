import { Component } from '@angular/core';
import {
    FlowerStrengthWidgetComponent
} from "../../../../components/widgets/flower-strength-widget/flower-strength-widget.component";

@Component({
  selector: 'app-home-tab-content',
  standalone: true,
    imports: [
        FlowerStrengthWidgetComponent
    ],
  templateUrl: './home-tab-content.component.html',
  styleUrl: './home-tab-content.component.css'
})
export class HomeTabContentComponent {
    securityLevel: number = 100;
}