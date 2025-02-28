import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Input() label: string = '';
  @Input() checkedColor: keyof typeof ThemeColors = 'DarkGreen';
  @Output() checkedChange = new EventEmitter<boolean>();

  toggleChecked() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
