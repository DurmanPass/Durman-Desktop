import { Injectable } from '@angular/core';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {TimelineNode} from "../../interfaces/components/view/timeline-view.interface";

@Injectable({
    providedIn: 'root'
})
export class TimelineGraphService {
    buildTimeline(entries: PasswordEntryInterface[], range: 'month' | 'year' | 'all' = 'all'): TimelineNode[] {
        const now = new Date();
        let minDate: Date;

        // Определяем минимальную дату для фильтрации
        switch (range) {
            case 'month':
                minDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'year':
                minDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                minDate = new Date(0); // Все записи
        }

        return entries
            .filter(entry => {
                // @ts-ignore
                const date = new Date(entry.metadata.updatedAt || entry.metadata.createdAt);
                return date >= minDate;
            })
            .map(entry => {
                // @ts-ignore
                const date = new Date(entry.metadata.updatedAt || entry.metadata.createdAt);
                const strength = entry.credentials.passwordStrength ?? 3;
                const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

                return {
                    id: `password-${entry.id}`,
                    type: 'password',
                    label: entry.name || 'Без имени',
                    category: entry.metadata.categoryLabel || 'Все',
                    email: entry.credentials.email || 'Без email',
                    date,
                    strength,
                    color: strength >= 3 ? '#2ecc71' : strength >= 1 ? '#f1c40f' : '#e74c3c',
                    isOutdated: date < sixMonthsAgo,
                    size: 10
                } as TimelineNode;
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}