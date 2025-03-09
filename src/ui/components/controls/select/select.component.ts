import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder: string = 'Выберите...';
  @Input() resetToDefault: boolean = false;
  @Input() disabled: boolean = false;
  @Output() optionSelected = new EventEmitter<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value) {
      this.optionSelected.emit(value);
      if(this.resetToDefault){
        target.value = '';
      }
    }
  }
}
