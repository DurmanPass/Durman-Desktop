import {ReportCard} from "../interfaces/data/reportCard.interface";
import {PasswordManagerService} from "./password/password-manager.service";


export class ReportService {
    // Приватный массив всех отчётов
    private static reports: ReportCard[] = [
        {
            id: 'weak-passwords',
            icon: 'fa-lock', // Предполагается использование FontAwesome или аналогичного
            title: 'Слабые пароли',
            description: 'Список паролей с низким уровнем безопасности (сила < 3)',
            action: ReportService.generateWeakPasswordsReport,
            isEnabled: true
        },
        {
            id: 'frequent-usage',
            icon: 'fa-clock',
            title: 'Часто используемые',
            description: 'Пароли, использованные более 5 раз',
            action: ReportService.generateFrequentUsageReport,
            isEnabled: true
        },
        {
            id: 'category-stats',
            icon: 'fa-chart-pie',
            title: 'Статистика по категориям',
            description: 'Распределение паролей по категориям',
            action: ReportService.generateCategoryStatsReport,
            isEnabled: true
        }
    ];

    // Получение всех отчётов
    public static getAllReports(): ReportCard[] {
        return [...this.reports]; // Возвращаем копию массива
    }

    // Получение отчёта по ID
    public static getReportById(id: string): ReportCard | undefined {
        return this.reports.find(report => report.id === id);
    }

    // Функции действий для каждого отчёта
    public static generateWeakPasswordsReport(): void {
        const weakPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.credentials.passwordStrength < 3);
        console.log('Отчёт о слабых паролях:', weakPasswords);
        // Здесь можно добавить логику сохранения в файл или отображения в UI
    }

    public static generateFrequentUsageReport(): void {
        const frequentPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.metadata.usageCount > 5);
        console.log('Отчёт о часто используемых паролях:', frequentPasswords);
    }

    public static generateCategoryStatsReport(): void {
        const categoryStats: { [key: string]: number } = {};
        PasswordManagerService.getAllEntries().forEach(entry => {
            const category = entry.metadata.category || 'Без категории';
            categoryStats[category] = (categoryStats[category] || 0) + 1;
        });
        console.log('Статистика по категориям:', categoryStats);
    }
}