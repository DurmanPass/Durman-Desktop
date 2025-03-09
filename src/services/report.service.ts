import {ReportCard} from "../interfaces/data/reportCard.interface";
import {PasswordManagerService} from "./password/password-manager.service";


export class ReportService {
    private static reports: ReportCard[] = [
        {
            id: 'weak-passwords',
            icon: 'assets/icons/controls/reports/weak-password.svg',
            title: 'Слабые пароли',
            description: 'Выявляет пароли с низким уровнем безопасности. Помогает найти уязвимые учётные записи, требующие немедленного усиления.',
            isEnabled: true,
            action: ReportService.generateWeakPasswordsReport
        },
        {
            id: 'frequent-usage',
            icon: 'assets/icons/controls/reports/reused-password.svg',
            title: 'Часто используемые',
            description: 'Позволяет обнаружить повторное использование паролей, увеличивающее риск компрометации.',
            action: ReportService.generateFrequentUsageReport,
            isEnabled: true
        },
        {
            id: 'non-security-sites',
            icon: 'assets/icons/controls/reports/unsecurity-password-url.svg',
            title: 'Небезопасные сайты',
            description: 'Список сайтов с потенциально небезопасными соединениями (без HTTPS) или сомнительной репутацией, где используются ваши пароли.',
            action: ReportService.generateUnsafeUrlReport,
            isEnabled: true
        }
    ];

    // Получение всех отчётов
    public static getAllReports(): ReportCard[] {
        return [...this.reports];
    }

    // Получение отчёта по ID
    public static getReportById(id: string): ReportCard | undefined {
        return this.reports.find(report => report.id === id);
    }
    public static generateWeakPasswordsReport(): void {
        const weakPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.credentials.passwordStrength < 3);
        //TODO Сгенерировать отчёт по слабым паролям
    }

    public static generateFrequentUsageReport(): void {
        const frequentPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.metadata.usageCount > 5);
        //TODO Сгенерировать отчёт по часто используемым паролям
    }

    public static generateUnsafeUrlReport(): void {
        //TODO Сгенерировать отчёт по слабым url
    }
}