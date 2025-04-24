import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {PieChartData} from "../../interfaces/components/view/pie-view.interface";

@Injectable({
    providedIn: 'root'
})
export class PieChartService {
    buildPieChartData(entries: PasswordEntryInterface[], groupBy: 'category' | 'email' | 'strength'): PieChartData[] {
        let groupedData: Map<string, PasswordEntryInterface[]>;
        let colorScale: (t: string) => string;

        // Группировка данных
        switch (groupBy) {
            case 'category':
                groupedData = d3.group(entries, d => d.metadata.categoryLabel || 'Все');
                colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Динамическая палитра для категорий
                break;
            case 'email':
                groupedData = d3.group(entries, d => d.credentials.email || 'Без email');
                colorScale = d3.scaleOrdinal(d3.schemeTableau10); // Другая палитра для email
                break;
            case 'strength':
                groupedData = d3.group(entries, d => {
                    const strength = d.credentials.passwordStrength ?? 3;
                    return strength >= 3 ? 'Сильный' : strength >= 1 ? 'Средний' : 'Слабый';
                });
                colorScale = (key: string) => {
                    switch (key) {
                        case 'Сильный':
                            return '#2ecc71';
                        case 'Средний':
                            return '#f1c40f';
                        default:
                            return '#e74c3c';
                    }
                };
                break;
        }

        // Преобразование в PieChartData
        return Array.from(groupedData, ([key, entries]) => ({
            key,
            value: entries.length,
            entries,
            color: colorScale(key)
        }));
    }
}