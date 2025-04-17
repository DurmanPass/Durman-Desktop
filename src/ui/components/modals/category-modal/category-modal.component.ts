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
import {Category} from "../../../../interfaces/data/category.interface";

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
  @Input() selectedCategory: Category | null = null;
  @Input() categoryService: CategoryService = new CategoryService(this.http);
  @Input() categoryLocalService: CategoryLocalService = new CategoryLocalService(this.categoryService);
  @Output() closed = new EventEmitter<void>();
  categoryEntry: string = '';
  isEditCategoryEntry: boolean = false;
  localCategory: Category | null = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit(){
    this.updateSelectedCategory();
  }

  clearData(){
    this.categoryEntry = '';
    this.localCategory = null;
  }

  ngOnChanges(): void {
    if(this.mode === CategoryModalModes.CREATE){
      this.isEditCategoryEntry = true;
    }
    this.updateSelectedCategory();
  }

  updateSelectedCategory(){
    if(this.selectedCategory){
      this.localCategory = this.selectedCategory;
      this.categoryEntry = this.selectedCategory.name;
    }
  }

  toggleEditCategoryEntry(){
    this.isEditCategoryEntry = !this.isEditCategoryEntry;
  }

  onCategoryChange(value: string){
    this.categoryEntry = value;
    if(this.localCategory){
      this.localCategory.name = value;
      this.updateSelectedCategory();
    }
  }

  async onCreateCategory(){
    if(this.categoryEntry.length === 0){return;}
    await this.categoryLocalService.createCategory(this.categoryEntry);
    this.closeModal();
    this.clearData();
  }

  async onUpdateCategory(){
    if(this.categoryEntry.length === 0){return;}
    if(!this.selectedCategory){return;}
    if(!this.localCategory){return;}
    await this.categoryLocalService.updateCategory(this.localCategory);
    this.closeModal();
  }

  closeModal(): void {
    this.closed.emit();
  }

  protected readonly CategoryModalModes = CategoryModalModes;
}
