import {Component, Input} from '@angular/core';
import {NgForOf, NgStyle} from "@angular/common";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";
import {FlowerStrengthLevels} from "../../../../shared/const/components/widgets/flower-strength.widget";

@Component({
  selector: 'app-flower-strength-widget',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    HeaderDescriptionComponent
  ],
  templateUrl: './flower-strength-widget.component.html',
  styleUrl: './flower-strength-widget.component.css'
})
export class FlowerStrengthWidgetComponent {
  @Input() securityLevel: number = 0;

  getGradientColor(index: number, position: 'start' | 'end'): string {
    if (this.securityLevel === 0) {
      return position === 'start' ? 'grey' : 'darkgrey';
    }

    // Нормализуем securityLevel в диапазон 0-1
    const factor = this.securityLevel / 100; // 0 → 0 (красный), 100 → 1 (зелёный)

    const redStart = Math.round((1 - factor) * 255); // Чем выше securityLevel, тем меньше красного
    const greenStart = Math.round(factor * 255); // Чем выше securityLevel, тем больше зелёного

    const redEnd = Math.max(0, redStart - 30); // Затемняем нижнюю часть градиента
    const greenEnd = Math.max(0, greenStart - 30);

    return position === 'start'
        ? `rgb(${redStart}, ${greenStart}, 0)`
        : `rgb(${redEnd}, ${greenEnd}, 0)`;
  }

  getSecurityText(): { title: string; description: string } {
    return FlowerStrengthLevels.find(
        (level) => this.securityLevel >= level.min && this.securityLevel <= level.max
    ) || FlowerStrengthLevels[0];
  }

  getColorPercentage(securityLevel: number){
    if(securityLevel === 0){
      return "Grey";
    }
    if(securityLevel < 30){
      return "DarkRed";
    }
    if(securityLevel > 30 && securityLevel < 60){
      return "DarkOrange";
    }
    if(securityLevel > 60 && securityLevel < 75){
      return "DarkGreen";
    }
    return "LightGreen";
  }

  protected readonly ThemeColors = ThemeColors;
}
