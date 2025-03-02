import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DefaultWidgetSize, WidgetSizes, WidgetSizesType} from "../../../../shared/const/components/sizes/WidgetSizes";
import {NgIf, NgStyle} from "@angular/common";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {ButtonsColors} from "../../../../shared/const/colors/buttons/buttonsColors";
import {ButtonsSizesType} from "../../../../shared/const/components/sizes/buttonsSizes";
import {TextAlignType} from "../../../../shared/const/components/text/text.align";

@Component({
  selector: 'app-widget-base',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    HeaderDescriptionComponent,
    SolidButtonComponent
  ],
  templateUrl: './widget-base.component.html',
  styleUrl: './widget-base.component.css'
})
export class WidgetBaseComponent {
  @Input() icon?: string='';
  @Input() title: string='';
  @Input() titleColor: keyof typeof ThemeColors ='White';
  @Input() titleSecond: string='';
  @Input() titleSecondColor?: keyof typeof ThemeColors ='White';
  @Input() description: string='';
  @Input() descriptionColor: keyof typeof ThemeColors ='Grey';
  @Input() button: boolean = true;
  @Input() buttonText: string = 'Подробнее';
  @Input() buttonColor: keyof typeof ButtonsColors ='Primary';
  @Input() buttonTextColor: keyof typeof ThemeColors = 'White';
  @Input() buttonSize: ButtonsSizesType = 'Large';
  @Input() backgroundColor: keyof typeof ThemeColors ='DarkGreen';
  @Input() borderRadius: string = '10px';
  @Input() size: WidgetSizesType = DefaultWidgetSize;
  @Input() textAlign: TextAlignType = 'Left';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  get widgetStyles() {
    return {
      width: WidgetSizes[this.size].width,
      height: WidgetSizes[this.size].height,
      background: this.backgroundColor,
      borderRadius: this.borderRadius
    };
  }
}
