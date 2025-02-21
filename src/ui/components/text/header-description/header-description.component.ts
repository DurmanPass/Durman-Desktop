import {Component, Input} from '@angular/core';
import {NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-header-description',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './header-description.component.html',
  styleUrl: './header-description.component.css'
})
export class HeaderDescriptionComponent {
  @Input() titleType: string = 'h2'; // по умолчанию h2
  @Input() title: string = ''; // текст заголовка
  @Input() description: string = ''; // текст описания
  @Input() titleColor: keyof typeof ThemeColors = "White"; // цвет заголовка по умолчанию
  @Input() descriptionColor: keyof typeof ThemeColors = "Grey"; // цвет описания по умолчанию
}
