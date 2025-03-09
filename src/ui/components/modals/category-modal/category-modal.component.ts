import {Component, Input} from '@angular/core';
import {CategoryModalModes} from "../../../../shared/enums/modes/modals/category-model-modes.enum";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";
import {InputComponent} from "../../inputs/input/input.component";
import {NgIf} from "@angular/common";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    NgIf,
    SolidButtonComponent
  ],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent {
  @Input() mode: CategoryModalModes = CategoryModalModes.CREATE;
  categoryEntry: string = '';
  isEditCategoryEntry: boolean = false;

  ngOnChanges(): void {
    if(this.mode === CategoryModalModes.CREATE){
      this.isEditCategoryEntry = true;
    }
  }

  toggleEditCategoryEntry(){
    this.isEditCategoryEntry = !this.isEditCategoryEntry;
  }

  onCategoryChange(value: string){
    this.categoryEntry = value;
  }

  protected readonly CategoryModalModes = CategoryModalModes;
}
