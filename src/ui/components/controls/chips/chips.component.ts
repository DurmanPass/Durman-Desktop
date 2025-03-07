import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() chips: string[] = [];
  @Input() selectedChips: string = 'All';
  @Output() chipsSelected = new EventEmitter<string>();
  @Output() addChipHandler = new EventEmitter<void>();

  selectChip(category: string): void {
    this.chipsSelected.emit(category);
  }

  onClickAddChip(){
    this.addChipHandler.emit();
  }
}
