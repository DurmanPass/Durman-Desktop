import {ReportCard} from "../interfaces/data/reportCard.interface";
import {PasswordManagerService} from "./password/password-manager.service";
import {DialogService} from "./filesystem/dialog.service";
import {WeakPasswordsReportTemplate} from "../shared/export-templates/reports/weak-passwords-report-template";
import {PasswordStrengthService} from "./password/password-strength.service";
import {invoke} from "@tauri-apps/api/core";
import {TauriCommands} from "../shared/const/app/tauri/tauri.commands";
import {UnsafeUrlReportTemplate} from "../shared/export-templates/reports/unsafe-url-report-template";


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
    public static async generateWeakPasswordsReport() {
        const selectedPath = await DialogService.selectPath();
        if(!selectedPath){
            return;
        }

        const weakPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.credentials.passwordStrength < 3);

        if (weakPasswords.length === 0) {
            console.log('Слабых паролей не найдено');
            return;
        }

        const passwordStrengthService = new PasswordStrengthService();

        // Генерируем HTML для каждой записи
        const weakPasswordEntries = weakPasswords.map(entry => {
            const feedback = passwordStrengthService.getPasswordFeedback(entry.credentials.password || '');
            const strength = entry.credentials.passwordStrength ?? passwordStrengthService.getPasswordScore(entry.credentials.password || '');

            // Формируем описание причин слабости
            const warning = feedback.warning ? `Причина: ${feedback.warning}` : 'Причина: Пароль слишком простой или предсказуемый.';
            const suggestions = feedback.suggestions.length > 0
                ? feedback.suggestions.map(s => `<li>${s}</li>`).join('')
                : '<li>Используйте более длинный пароль с буквами, цифрами и символами.</li>';

            return `
        <div class="password-entry">
          <h2>Запись: ${entry.name}</h2>
          <div class="password-details">
            <p><strong>URL:</strong> ${entry.location.url || 'Не указан'}</p>
            <p><strong>Электронная почта:</strong> ${entry.credentials.email || 'Не указано'}</p>
            <p><strong>Имя пользователя:</strong> ${entry.credentials.username || 'Не указано'}</p>
            <p><strong>Номер телефона:</strong> ${entry.credentials.phoneNumber || 'Не указано'}</p>
            <p><strong>Пароль:</strong> ${entry.credentials.password || 'Не указан'}</p>
            <p><strong>Категория:</strong> ${entry.metadata.category || 'Без категории'}</p>
            <p><strong>Сила пароля:</strong> ${strength} из 4</p>
          </div>
          <div class="feedback">
            <strong>Почему пароль слабый?</strong>
            <p>${warning}</p>
          </div>
          <div class="recommendations">
            <strong>Рекомендации:</strong>
            <ul>${suggestions}</ul>
          </div>
        </div>
      `;
        }).join('');

        // Подставляем записи в шаблон
        const htmlContent = WeakPasswordsReportTemplate.replace('{{WEAK_PASSWORD_ENTRIES}}', weakPasswordEntries);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fullPath = `${selectedPath}/weak-passwords-report-${new Date().toISOString().slice(0, 10)}.html`;

        // Сохраняем файл через Tauri
        await invoke<string>(TauriCommands.SAVE_FILE, {
            data: Array.from(uint8Array),
            filePath: fullPath
        });

        console.log(`Отчёт сохранён: ${fullPath}`);
    }

    public static generateFrequentUsageReport(): void {
        const frequentPasswords = PasswordManagerService.getAllEntries()
            .filter(entry => entry.metadata.usageCount > 5);
        //TODO Сгенерировать отчёт по часто используемым паролям
    }

    // Проверка, является ли URL небезопасным
    private static isUrlUnsafe(url: string | undefined, domain: string): boolean {
        if (!url || typeof url !== 'string') {
            return false;
        }

        try {
            const lowerUrl = url.toLowerCase();
            const unsafeTlds = ['.xyz', '.top', '.info', '.club'];

            return (
                !lowerUrl.startsWith('https://') ||
                unsafeTlds.some(tld => domain.endsWith(tld)) ||
                (domain.length > 0 && domain.length < 5)
            );
        } catch (error) {
            console.error('Ошибка в isUrlUnsafe для URL:', url, error);
            return false; // Пропускаем проблемный URL
        }
    }

    // Генерация обратной связи для небезопасного URL
    private static getUrlSafetyFeedback(url: string, domain: string): { reason: string, suggestions: string[] } {
        if (!url) {
            return { reason: 'URL не указан.', suggestions: ['Добавьте корректный URL для записи.'] };
        }

        const lowerUrl = url.toLowerCase();
        let reason = '';
        const suggestions: string[] = [];

        if (!lowerUrl.startsWith('https://')) {
            reason = 'Сайт использует незащищённое соединение HTTP вместо HTTPS.';
            suggestions.push('Используйте сайты с HTTPS для защиты данных.');
            suggestions.push('Проверьте, доступна ли версия сайта с HTTPS.');
        } else if (['.xyz', '.top', '.info', '.club'].some(tld => domain.endsWith(tld))) {
            reason = 'Домен верхнего уровня считается подозрительным и может быть связан с мошенничеством.';
            suggestions.push('Избегайте использования сайтов с такими доменами.');
            suggestions.push('Проверьте репутацию сайта через онлайн-сервисы.');
        } else if (domain.length > 0 && domain.length < 5) {
            reason = 'Домен слишком короткий и может указывать на сомнительный сайт.';
            suggestions.push('Будьте осторожны с короткими доменами.');
            suggestions.push('Убедитесь, что это официальный сайт.');
        } else {
            reason = 'Сайт может быть небезопасным по другим причинам.';
            suggestions.push('Проверьте сайт на наличие сертификата безопасности.');
        }

        return { reason, suggestions };
    }

    /**
     * Генерирует отчёт о небезопасных URL в HTML
     */
    public static async generateUnsafeUrlReport() {

        const entries = PasswordManagerService.getAllEntries();
        if (entries.length === 0) {
            console.log('Записей не найдено');
            return;
        }
        
        const selectedPath = await DialogService.selectPath();
        if(!selectedPath){
            return;
        }

        const uniqueEntriesMap = new Map<string, typeof entries[0]>();
        entries.forEach(entry => {
            if (entry.id) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        // Проверяем фильтрацию небезопасных URL
        let unsafeUrls: typeof entries;
        try {
            unsafeUrls = Array.from(uniqueEntriesMap.values()).filter(entry => {
                try {
                    return ReportService.isUrlUnsafe(entry.location.url, entry.location.domain);
                } catch (innerError) {
                    return false;
                }
            });
        } catch (filterError) {
            return;
        }
        if (unsafeUrls.length === 0) {
            return;
        }

          // Генерируем HTML для каждой небезопасной записи
          const unsafeUrlEntries = unsafeUrls.map(entry => {
              const { reason, suggestions } = ReportService.getUrlSafetyFeedback(entry.location.url, entry.location.domain);

              return `
          <div class="url-entry">
            <h2>Запись: ${entry.name}</h2>
            <div class="url-details">
              <p><strong>URL:</strong> ${entry.location.url || 'Не указан'}</p>
              <p><strong>Имя пользователя:</strong> ${entry.credentials.username || 'Не указано'}</p>
              <p><strong>Пароль:</strong> ${entry.credentials.password || 'Не указан'}</p>
              <p><strong>Категория:</strong> ${entry.metadata.category || 'Без категории'}</p>
            </div>
            <div class="risk">
              <strong>Почему сайт небезопасен?</strong>
              <p>${reason ? reason : ''}</p>
            </div>
            <div class="recommendations">
              <strong>Рекомендации:</strong>
              <ul>${suggestions.length > 0 ? suggestions.map(s => `<li>${s}</li>`).join('') : ''}</ul>
            </div>
          </div>
        `;
          }).join('');

        const htmlContent = UnsafeUrlReportTemplate.replace('{{UNSAFE_URL_ENTRIES}}', unsafeUrlEntries);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const fullPath = `${selectedPath}/unsafe-url-report-${new Date().toISOString().slice(0, 10)}.html`;

        await invoke<string>(TauriCommands.SAVE_FILE, {
            data: Array.from(uint8Array),
            filePath: fullPath
        });
    }
}