import {Component, Input} from '@angular/core';
import {
  ButtonsColors,
  ButtonsColorsType, DefaultButtonColor,
} from "../../../../shared/const/colors/buttons/buttonsColors";
import {ButtonSizes, ButtonsSizesType, DefaultButtonSize} from "../../../../shared/const/components/sizes/buttonsSizes";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-solid-button',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './solid-button.component.html',
  styleUrl: './solid-button.component.css'
})
export class SolidButtonComponent {
  @Input() bgColor: ButtonsColorsType = DefaultButtonColor;
  @Input() size: ButtonsSizesType = DefaultButtonSize;
  @Input() text: string = '';
  @Input() textColor: keyof typeof ThemeColors = 'White';
  @Input() disabled: boolean = false;

  get bgButtonColor() {
    return ButtonsColors[this.bgColor] || ButtonsColors[DefaultButtonColor];
  }

  get buttonSize() {
    return ButtonSizes[this.size] || ButtonSizes[DefaultButtonSize];
  }
}
