import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {KanbanColumn} from "../../../../interfaces/components/view/kanban-view.interface";
import {KanbanService} from "../../../../services/kanban/kanban.service";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-password-kanban',
  standalone: true,
  imports: [
    NgForOf,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag
  ],
  templateUrl: './password-kanban.component.html',
  styleUrl: './password-kanban.component.css'
})
export class PasswordKanbanComponent {
  @Input() entries: PasswordEntryInterface[] = [];
  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() addEntry = new EventEmitter<void>();
  @Output() updateEntry = new EventEmitter<PasswordEntryInterface>();

  columns: KanbanColumn[] = [];
  groupBy: 'category' | 'strength' = 'category';
  visibleColumns: string[] = [];

  constructor(private kanbanService: KanbanService) {}

  ngOnInit(): void {
    this.updateKanban();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries']) {
      this.updateKanban();
    }
  }

  setGroupBy(groupBy: 'category' | 'strength'): void {
    this.groupBy = groupBy;
    this.visibleColumns = [];
    this.updateKanban();
  }

  toggleColumn(columnKey: string): void {
    if (this.visibleColumns.includes(columnKey)) {
      this.visibleColumns = this.visibleColumns.filter(key => key !== columnKey);
    } else {
      this.visibleColumns.push(columnKey);
    }
  }

  drop(event: CdkDragDrop<PasswordEntryInterface[]>, targetColumn: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      // Перемещение внутри колонки
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Перемещение между колонками
      const entry = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
      );

      // Обновление категории пароля
      if (this.groupBy === 'category') {
        const updatedEntry = {
          ...entry,
          metadata: {
            ...entry.metadata,
            categoryLabel: targetColumn.key === 'Все' ? null : targetColumn.key
          }
        };
        this.updateEntry.emit(updatedEntry);
      }
    }
  }

  trackById(index: number, entry: PasswordEntryInterface): string {
    return <string>entry.id;
  }

  trackByKey(index: number, column: KanbanColumn): string {
    return column.key;
  }

  getStrengthColor(strength: number | undefined): string {
    const s = strength ?? 3;
    return s >= 3 ? '#2ecc71' : s >= 1 ? '#f1c40f' : '#e74c3c';
  }

  onEditEntry(id: string): void {
    this.editEntry.emit(id);
  }

  onCopyEntry(id: string): void {
    this.copyEntry.emit(id);
  }

  onDeleteEntry(id: string): void {
    this.deleteEntry.emit(id);
  }

  private updateKanban(): void {
    this.columns = this.kanbanService.buildKanbanData(this.entries, this.groupBy);
    if (!this.visibleColumns.length && this.columns.length) {
      this.visibleColumns = this.columns.map(c => c.key); // Показываем все колонки по умолчанию
    }
  }
}
