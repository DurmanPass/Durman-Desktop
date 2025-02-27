import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {
  ButtonSizes,
  ButtonsSizesType, getHeightButtonSize,
  getWidthButtonSize
} from "../../../../shared/const/components/sizes/buttonsSizes";
@Component({
  selector: 'app-round-button',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './round-button.component.html',
  styleUrl: './round-button.component.css'
})
export class RoundButtonComponent {
  @Input() backgroundColor: keyof typeof ThemeColors = "Transparent";
  @Input() borderColor: keyof typeof ThemeColors = "White";
  @Input() size: ButtonsSizesType = "RoundSmall";
  @Input() text: string = '';
  @Input() icon: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }

  protected readonly ButtonSizes = ButtonSizes;
  protected readonly getWidthButtonSize = getWidthButtonSize;
  protected readonly getHeightButtonSize = getHeightButtonSize;
}
