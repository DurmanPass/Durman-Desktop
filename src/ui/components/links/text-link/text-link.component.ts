import {Component, Input} from '@angular/core';
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-text-link',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './text-link.component.html',
  styleUrl: './text-link.component.css'
})
export class TextLinkComponent {
  @Input() text: string = '';
  @Input() href?: string;
  @Input() color: string = ThemeColors.Primary;
}
