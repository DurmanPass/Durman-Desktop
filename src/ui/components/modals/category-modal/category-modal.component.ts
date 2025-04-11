import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CategoryModalModes} from "../../../../shared/enums/modes/modals/category-model-modes.enum";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";
import {InputComponent} from "../../inputs/input/input.component";
import {NgIf} from "@angular/common";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {ToastService} from "../../../../services/notification/toast.service";
import {CategoryLocalService} from "../../../../services/category/category-local.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CategoryService} from "../../../../services/routes/category/category.service";

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    InputComponent,
    NgIf,
    SolidButtonComponent,
      HttpClientModule
  ],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent {
  @Input() mode: CategoryModalModes = CategoryModalModes.CREATE;
  @Input() categoryService: CategoryService = new CategoryService(this.http);
  @Input() categoryLocalService: CategoryLocalService = new CategoryLocalService(this.categoryService);
  @Output() closed = new EventEmitter<void>();
  categoryEntry: string = '';
  isEditCategoryEntry: boolean = false;

  constructor(private http: HttpClient) {
  }

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

  async onCreateCategory(){
    if(this.categoryEntry.length === 0){return;}
    await this.categoryLocalService.createCategory(this.categoryEntry);
    this.closeModal();
  }

  closeModal(): void {
    this.closed.emit();
  }

  protected readonly CategoryModalModes = CategoryModalModes;
}
