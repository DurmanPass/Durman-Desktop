import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Category} from "../../../../interfaces/data/category.interface";
import {ContextMenuComponent} from "../../contextMenus/context-menu/context-menu.component";
import {ContextMenuItem} from "../../../../interfaces/components/context-menu-item.interface";
import {CategoryContextMenu} from "../../../../shared/const/contextMenu/category.contextmenu";
import {PositionEnum} from "../../../../shared/enums/position.enum";
import {HttpClient} from "@angular/common/http";
import {CategoryService} from "../../../../services/routes/category/category.service";
import {CategoryLocalService} from "../../../../services/category/category-local.service";
import {CategoryModalModes} from "../../../../shared/enums/modes/modals/category-model-modes.enum";

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ContextMenuComponent
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() chips: string[] = [];
  @Input() categories: Category[] = [];
  @Input() selectedChips: string = 'All';
  @Input() hideAllChip: boolean = false;
  @Input() hideAddChip: boolean = false;
  @Output() chipsSelected = new EventEmitter<string>();
  @Output() addChipHandler = new EventEmitter<CategoryModalModes>();
  @Input() categoryService: CategoryService = new CategoryService(this.http);
  @Input() categoryLocalService: CategoryLocalService = new CategoryLocalService(this.categoryService);
  @Output() categoryDeleted = new EventEmitter<void>();
  @Output() onSelectedCategory = new EventEmitter<Category>();

  CategoryContextMenuFilter: ContextMenuItem[] = [];

  contextMenus = {
    category: {
      showContextMenu: false,
      contextMenuPosition: { x: 0, y: 0 }
    }
  }

  constructor(private http: HttpClient) {
  }

  selectedCategory: Category | null = null;

  async ngOnInit() {
  }

  selectChip(category: string): void {
    this.chipsSelected.emit(category);
  }

  onClickAddChip(mode: CategoryModalModes){
    this.addChipHandler.emit(mode);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await this.categoryLocalService.deleteCategory(categoryId);
      this.categoryDeleted.emit();
    } catch (e) {}
  }

  updateCategory(category: Category){
    this.addChipHandler.emit(CategoryModalModes.EDIT);
  }

  onShowCategoryContextMenu(event: MouseEvent, category: Category): void {
    event.preventDefault();
    event.stopPropagation();
    this.onSelectedCategory.emit(category);
    this.selectedCategory = category;
    this.CategoryContextMenuFilter = CategoryContextMenu(
        category,
        this.updateCategory.bind(this),
        this.deleteCategory.bind(this)
    );
    this.contextMenus.category.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenus.category.showContextMenu = true;
  }

  onCloseCategoryContextMenu(){
    this.contextMenus.category.showContextMenu = false;
  }

  protected readonly PositionEnum = PositionEnum;
  protected readonly CategoryModalModes = CategoryModalModes;
}
