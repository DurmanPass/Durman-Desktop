import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {KanbanColumn} from "../../interfaces/components/view/kanban-view.interface";

@Injectable({
    providedIn: 'root'
})
export class KanbanService {
    buildKanbanData(entries: PasswordEntryInterface[], groupBy: 'category' | 'strength'): KanbanColumn[] {
        let groupedData: Map<string, PasswordEntryInterface[]>;

        // Группировка данных
        switch (groupBy) {
            case 'category':
                groupedData = d3.group(entries, d => d.metadata.categoryLabel || 'Все');
                break;
            case 'strength':
                groupedData = d3.group(entries, d => {
                    const strength = d.credentials.passwordStrength ?? 3;
                    return strength >= 3 ? 'Сильный' : strength >= 1 ? 'Средний' : 'Слабый';
                });
                break;
        }

        // Преобразование в KanbanColumn
        return Array.from(groupedData, ([key, entries]) => ({
            key,
            entries
        })).sort((a, b) => a.key.localeCompare(b.key));
    }
}