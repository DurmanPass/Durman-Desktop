import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableColumn} from "../../../../interfaces/components/table/tableColumn.interface";
import {NgForOf, NgIf} from "@angular/common";
import {ToastService} from "../../../../services/notification/toast.service";

@Component({
  selector: 'app-entries-table',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './entries-table.component.html',
  styleUrl: './entries-table.component.css'
})
export class EntriesTableComponent<T> {
  @Input() columns: TableColumn<T>[] = []; // Конфигурация колонок
  @Input() entries: T[] = [];              // Данные любого типа
  @Input() showActions: boolean = true;    // Показывать ли колонку действий

  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();

  onCopyEntry(id: string): void {
    this.copyEntry.emit(id);
    ToastService.success('Пароль был успешно скопирован в буфер обмена!')
  }

  onEditEntry(id: string): void {
    this.editEntry.emit(id);
  }

  onDeleteEntry(id: string): void {
    this.deleteEntry.emit(id);
    ToastService.danger('Запись была успешно удалена!')
  }

  // Универсальный метод для получения ID из объекта (предполагаем, что у объекта есть поле id)
  getEntryId(entry: T): string {
    return (entry as any).id || '';
  }
}
