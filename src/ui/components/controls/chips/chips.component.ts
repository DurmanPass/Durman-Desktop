import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() chips: string[] = [];
  @Input() selectedChips: string = 'All';
  @Input() hideAllChip: boolean = false;
  @Input() hideAddChip: boolean = false;
  @Output() chipsSelected = new EventEmitter<string>();
  @Output() addChipHandler = new EventEmitter<void>();

  selectChip(category: string): void {
    this.chipsSelected.emit(category);
  }

  onClickAddChip(){
    this.addChipHandler.emit();
  }
}
