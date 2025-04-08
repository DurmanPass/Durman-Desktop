import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-focus-overlay',
  standalone: true,
  imports: [],
  templateUrl: './focus-overlay.component.html',
  styleUrl: './focus-overlay.component.css'
})
export class FocusOverlayComponent {
  @Output() overlayClicked = new EventEmitter<void>();

  onClick(): void {
    this.overlayClicked.emit();
  }
}
