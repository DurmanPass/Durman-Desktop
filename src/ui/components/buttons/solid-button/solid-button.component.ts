import {Component, Input} from '@angular/core';
import {
  ButtonsColors,
  ButtonsColorsType, DefaultButtonColor,
} from "../../../../shared/const/colors/buttons/buttonsColors";
import {ButtonSizes, ButtonsSizesType, DefaultButtonSize} from "../../../../shared/const/components/sizes/buttonsSizes";

@Component({
  selector: 'app-solid-button',
  standalone: true,
  imports: [],
  templateUrl: './solid-button.component.html',
  styleUrl: './solid-button.component.css'
})
export class SolidButtonComponent {
  @Input() bgColor: ButtonsColorsType = DefaultButtonColor;
  @Input() size: ButtonsSizesType = DefaultButtonSize;
  @Input() text: string = '';

  get bgButtonColor() {
    return ButtonsColors[this.bgColor] || ButtonsColors[DefaultButtonColor];
  }

  get buttonSize() {
    return ButtonSizes[this.size] || ButtonSizes[DefaultButtonSize];
  }
}
