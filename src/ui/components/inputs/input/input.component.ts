import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {DefaultInputSize, InputSizes, InputSizesType} from "../../../../shared/const/components/sizes/inputSizes";
import {DefaultLabelSide, LabelSideType} from "../../../../shared/const/components/labels/label.side";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() type: string = 'text'; // Тип инпута (по умолчанию text)
  @Input() size: InputSizesType = DefaultInputSize; // Размер инпута
  @Input() color: keyof typeof ThemeColors = "White";
  @Input() borderColor?: keyof typeof ThemeColors; // Цвет границы
  @Input() backgroundColor?: keyof typeof ThemeColors; // Цвет фона
  @Input() placeholder: string = ''; // Плейсхолдер
  @Input() label?: string; // Текст label
  @Input() labelSide: LabelSideType = DefaultLabelSide; // Расположение label
  @Input() value: string = '';
  @Input() isEditable: boolean = true;
  @Input() minLength: number = 0;
  @Input() maxLength: number = 300;
  @Input() maxValue: number = 0;
  @Input() minValue: number = 0;
  @Output() valueChange = new EventEmitter<string>(); // Отправляем значение при изменении

  inputValue: string = '';

  onInputChange(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(this.inputValue);
  }

  protected readonly ThemeColors = ThemeColors;
  protected readonly InputSizes = InputSizes;
}
