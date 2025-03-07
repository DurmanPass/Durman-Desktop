import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-modal-base',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.css'
})
export class ModalBaseComponent {
  @Input() isOpen: boolean = false;
  @Input() closeOnOverlayClick: boolean = true;
  @Input() contentBackgroundColor: keyof typeof ThemeColors = 'DarkPurple';
  @Input() contentBorderRadius: string = '8px';
  @Output() closed = new EventEmitter<void>();

  closeModal(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
