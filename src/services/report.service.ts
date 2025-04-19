import {ReportCard} from "../interfaces/data/reportCard.interface";
import {PasswordManagerService} from "./password/password-manager.service";
import {DialogService} from "./filesystem/dialog.service";
import {WeakPasswordsReportTemplate} from "../shared/export-templates/reports/weak-passwords-report-template";
import {PasswordStrengthService} from "./password/password-strength.service";
import {invoke} from "@tauri-apps/api/core";
import {TauriCommands} from "../shared/const/app/tauri/tauri.commands";
import {UnsafeUrlReportTemplate} from "../shared/export-templates/reports/unsafe-url-report-template";
import {PasswordEntryInterface} from "../interfaces/data/passwordEntry.interface";
import {FrequentUsageReportTemplate} from "../shared/export-templates/reports/frequent-usage-report-template";
import {ToastService} from "./notification/toast.service";
import {DecryptValue} from "../utils/crypto.utils";
import {join, normalize} from "@tauri-apps/api/path";
import {writeFile} from "@tauri-apps/plugin-fs";
//
//
// export class ReportService {
//     private static reports: ReportCard[] = [
//         {
//             id: 'weak-passwords',
//             icon: 'assets/icons/controls/reports/weak-password.svg',
//             title: 'Слабые пароли',
//             description: 'Выявляет пароли с низким уровнем безопасности. Помогает найти уязвимые учётные записи, требующие немедленного усиления.',
//             isEnabled: true,
//             action: ReportService.generateWeakPasswordsReport
//         },
//         {
//             id: 'frequent-usage',
//             icon: 'assets/icons/controls/reports/reused-password.svg',
//             title: 'Часто используемые',
//             description: 'Позволяет обнаружить повторное использование паролей, увеличивающее риск компрометации.',
//             action: ReportService.generateFrequentUsageReport,
//             isEnabled: true
//         },
//         {
//             id: 'non-security-sites',
//             icon: 'assets/icons/controls/reports/unsecurity-password-url.svg',
//             title: 'Небезопасные сайты',
//             description: 'Список сайтов с потенциально небезопасными соединениями (без HTTPS) или сомнительной репутацией, где используются ваши пароли.',
//             action: ReportService.generateUnsafeUrlReport,
//             isEnabled: true
//         }
//     ];
//
//     // Получение всех отчётов
//     public static getAllReports(): ReportCard[] {
//         return [...this.reports];
//     }
//
//     // Получение отчёта по ID
//     public static getReportById(id: string): ReportCard | undefined {
//         return this.reports.find(report => report.id === id);
//     }
//
//     public static async generateWeakPasswordsReport(): Promise<void> {
//         const selectedPath = await DialogService.selectPath();
//         if (!selectedPath) {
//             console.log('No path selected for weak passwords report');
//             return;
//         }
//
//         const passwords = await Promise.all(
//             PasswordManagerService.getAllEntries().map(async (entry) => {
//                 entry.credentials.password = await DecryptValue(
//                     entry.credentials.password,
//                     entry.credentials.encryption_iv
//                 );
//                 return entry;
//             })
//         );
//
//         const weakPasswords = passwords.filter(
//             (entry) => entry.credentials.passwordStrength && entry.credentials.passwordStrength < 3
//         );
//
//         if (weakPasswords.length === 0) {
//             console.log('Слабых паролей не найдено');
//             ToastService.warning('Слабых паролей не найдено');
//             return;
//         }
//
//         const passwordStrengthService = new PasswordStrengthService();
//
//         // Экранирование HTML для безопасного вывода
//         const escapeHtml = (unsafe: string | undefined): string => {
//             if (!unsafe) return 'Не указано';
//             return unsafe
//                 .replace(/&/g, '&amp;')
//                 .replace(/</g, '&lt;')
//                 .replace(/>/g, '&gt;')
//                 .replace(/"/g, '&quot;')
//                 .replace(/'/g, '&#039;');
//         };
//
//         // Генерируем HTML для каждой записи
//         const weakPasswordEntries = weakPasswords.map(entry => {
//             const feedback = passwordStrengthService.getPasswordFeedback(entry.credentials.password || '');
//             const strength = entry.credentials.passwordStrength ?? passwordStrengthService.getPasswordScore(entry.credentials.password || '');
//
//             // Формируем описание причин слабости
//             const warning = feedback.warning ? `Причина: ${escapeHtml(feedback.warning)}` : 'Причина: Пароль слишком простой или предсказуемый.';
//             const suggestions = feedback.suggestions.length > 0
//                 ? feedback.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')
//                 : '<li>Используйте более длинный пароль с буквами, цифрами и символами.</li>';
//
//             return `
//         <div class="password-entry">
//           <h2>Запись: ${escapeHtml(entry.name ? entry.name : '-')}</h2>
//           <div class="password-details">
//             <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
//             <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
//             <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
//             <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
//             <p><strong>Пароль:</strong> ${escapeHtml(entry.credentials.password ? entry.credentials.password : 'Не указан')}</p>
//             <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
//             <p><strong>Сила пароля:</strong> ${strength} из 4</p>
//           </div>
//           <div class="feedback">
//             <strong>Почему пароль слабый?</strong>
//             <p>${warning}</p>
//           </div>
//           <div class="recommendations">
//             <strong>Рекомендации:</strong>
//             <ul>${suggestions}</ul>
//           </div>
//         </div>
//       `;
//         }).join('');
//
//         // Подставляем записи в шаблон
//         if (!WeakPasswordsReportTemplate) {
//             console.error('Weak passwords report template is empty or not loaded');
//             throw new Error('Report template is not available');
//         }
//
//         const htmlContent = WeakPasswordsReportTemplate.replace('{{WEAK_PASSWORD_ENTRIES}}', weakPasswordEntries);
//         const encoder = new TextEncoder();
//         const uint8Array = encoder.encode(htmlContent);
//         if (typeof selectedPath !== "string") {
//             return;
//         }
//         const fullPath = await join(selectedPath, `weak-passwords-report-${new Date().toISOString().slice(0, 10)}.html`);
//         const normalizedPath = await normalize(fullPath);
//
//         try {
//             console.log('Saving weak passwords report to:', normalizedPath);
//             console.log('HTML content length:', htmlContent.length);
//             await writeFile(normalizedPath, uint8Array);
//             console.log('Weak passwords report saved successfully');
//             ToastService.success('Отчёт о слабых паролях успешно создан!');
//         } catch (err) {
//             console.error('Error saving weak passwords report:', err);
//             ToastService.danger('Не удалось создать отчёт о слабых паролях');
//             throw new Error('Failed to generate weak passwords report');
//         }
//     }
//
//     public static async generateFrequentUsageReport(): Promise<void> {
//         const selectedPath = await DialogService.selectPath();
//         if (!selectedPath) {
//             console.log('No path selected for frequent usage report');
//             return;
//         }
//
//         const passwordStrengthService = new PasswordStrengthService();
//         const reusedEntries = await passwordStrengthService.getReusedPasswords();
//         if (reusedEntries.length === 0) {
//             console.log('Переиспользуемых паролей не найдено');
//             ToastService.warning('Переиспользуемых паролей не найдено');
//             return;
//         }
//
//         const passwordGroups = new Map<string, PasswordEntryInterface[]>();
//         reusedEntries.forEach((entry: PasswordEntryInterface) => {
//             const password = entry.credentials.password || '';
//             const group = passwordGroups.get(password) || [];
//             group.push(entry);
//             passwordGroups.set(password, group);
//         });
//
//         // Экранирование HTML для безопасного вывода
//         const escapeHtml = (unsafe: string | undefined): string => {
//             if (!unsafe) return 'Не указано';
//             return unsafe
//                 .replace(/&/g, '&amp;')
//                 .replace(/</g, '&lt;')
//                 .replace(/>/g, '&gt;')
//                 .replace(/"/g, '&quot;')
//                 .replace(/'/g, '&#039;');
//         };
//
//         const reusedPasswordGroups = Array.from(passwordGroups.entries()).map(([password, entries]) => {
//             const entryCards = entries.map(entry => `
//           <div class="entry-card">
//             <p><strong>Название:</strong> ${escapeHtml(entry.name ? entry.name : 'Не указано')}</p>
//             <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
//             <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
//             <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
//             <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
//             <p><strong>Пароль:</strong> ${escapeHtml(entry.credentials.password ? entry.credentials.password : 'Не указан')}</p>
//             <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
//           </div>
//         `).join('');
//
//             return `
//           <div class="password-group">
//             <h2>Пароль: "${escapeHtml(password)}" (используется ${entries.length} раз)</h2>
//             ${entryCards}
//             <div class="recommendations">
//               <strong>Рекомендации:</strong>
//               <ul>
//                 <li>Используйте уникальный пароль для каждой записи.</li>
//                 <li>Сгенерируйте новый сложный пароль в менеджере паролей.</li>
//                 <li>Обновите этот пароль на всех указанных сайтах.</li>
//               </ul>
//             </div>
//           </div>
//         `;
//         }).join('') || '<p>Переиспользуемых паролей не найдено.</p>';
//
//         // Подставляем группы в шаблон
//         if (!FrequentUsageReportTemplate) {
//             console.error('Frequent usage report template is empty or not loaded');
//             throw new Error('Report template is not available');
//         }
//
//         const htmlContent = FrequentUsageReportTemplate.replace('{{REUSED_PASSWORD_GROUPS}}', reusedPasswordGroups);
//         const encoder = new TextEncoder();
//         const uint8Array = encoder.encode(htmlContent);
//         if (typeof selectedPath !== 'string') {
//             console.error('Selected path is not a string:', selectedPath);
//             return;
//         }
//         const fullPath = await join(selectedPath, `frequent-usage-report-${new Date().toISOString().slice(0, 10)}.html`);
//         const normalizedPath = await normalize(fullPath);
//
//         try {
//             console.log('Saving frequent usage report to:', normalizedPath);
//             console.log('HTML content length:', htmlContent.length);
//             await writeFile(normalizedPath, uint8Array);
//             console.log('Frequent usage report saved successfully');
//             ToastService.success(`Отчёт о часто используемых паролях успешно создан! Найдено групп: ${passwordGroups.size}`);
//         } catch (err) {
//             console.error('Error saving frequent usage report:', err);
//             ToastService.danger('Не удалось создать отчёт о часто используемых паролях');
//             throw new Error('Failed to generate frequent usage report');
//         }
//     }
//
//     // Проверка, является ли URL небезопасным
//     private static isUrlUnsafe(url: string | undefined, domain: string): boolean {
//         if (!url || typeof url !== 'string') {
//             return false;
//         }
//
//         try {
//             const lowerUrl = url.toLowerCase();
//             const unsafeTlds = ['.xyz', '.top', '.info', '.club'];
//
//             return (
//                 !lowerUrl.startsWith('https://') ||
//                 unsafeTlds.some(tld => domain.endsWith(tld)) ||
//                 (domain.length > 0 && domain.length < 5)
//             );
//         } catch (error) {
//             console.error('Ошибка в isUrlUnsafe для URL:', url, error);
//             return false; // Пропускаем проблемный URL
//         }
//     }
//
//     // Генерация обратной связи для небезопасного URL
//     private static getUrlSafetyFeedback(url: string, domain: string): { reason: string, suggestions: string[] } {
//         if (!url) {
//             return { reason: 'URL не указан.', suggestions: ['Добавьте корректный URL для записи.'] };
//         }
//
//         const lowerUrl = url.toLowerCase();
//         let reason = '';
//         const suggestions: string[] = [];
//
//         if (!lowerUrl.startsWith('https://')) {
//             reason = 'Сайт использует незащищённое соединение HTTP вместо HTTPS.';
//             suggestions.push('Используйте сайты с HTTPS для защиты данных.');
//             suggestions.push('Проверьте, доступна ли версия сайта с HTTPS.');
//         } else if (['.xyz', '.top', '.info', '.club'].some(tld => domain.endsWith(tld))) {
//             reason = 'Домен верхнего уровня считается подозрительным и может быть связан с мошенничеством.';
//             suggestions.push('Избегайте использования сайтов с такими доменами.');
//             suggestions.push('Проверьте репутацию сайта через онлайн-сервисы.');
//         } else if (domain.length > 0 && domain.length < 5) {
//             reason = 'Домен слишком короткий и может указывать на сомнительный сайт.';
//             suggestions.push('Будьте осторожны с короткими доменами.');
//             suggestions.push('Убедитесь, что это официальный сайт.');
//         } else {
//             reason = 'Сайт может быть небезопасным по другим причинам.';
//             suggestions.push('Проверьте сайт на наличие сертификата безопасности.');
//         }
//
//         return { reason, suggestions };
//     }
//
//     /**
//      * Генерирует отчёт о небезопасных URL в HTML
//      */
//     public static async generateUnsafeUrlReport(): Promise<void> {
//         const entries = PasswordManagerService.getAllEntries();
//         if (entries.length === 0) {
//             console.log('Записей не найдено');
//             ToastService.warning('Записей не найдено');
//             return;
//         }
//
//         const selectedPath = await DialogService.selectPath();
//         if (!selectedPath) {
//             console.log('No path selected for unsafe URL report');
//             return;
//         }
//
//         const uniqueEntriesMap = new Map<string, typeof entries[0]>();
//         entries.forEach(entry => {
//             if (entry.id) {
//                 uniqueEntriesMap.set(entry.id, entry);
//             }
//         });
//
//         let unsafeUrls: typeof entries;
//         try {
//             unsafeUrls = Array.from(uniqueEntriesMap.values()).filter(entry => {
//                 try {
//                     return ReportService.isUrlUnsafe(
//                         entry.location.url ? entry.location.url : '',
//                         entry.location.domain ? entry.location.domain : ''
//                     );
//                 } catch (innerError) {
//                     console.warn('Error checking URL safety:', innerError);
//                     return false;
//                 }
//             });
//         } catch (filterError) {
//             console.error('Error filtering unsafe URLs:', filterError);
//             ToastService.danger('Не удалось обработать небезопасные URL');
//             return;
//         }
//
//         if (unsafeUrls.length === 0) {
//             console.log('Небезопасных URL не найдено');
//             ToastService.warning('Небезопасных URL не найдено');
//             return;
//         }
//
//         // Экранирование HTML для безопасного вывода
//         const escapeHtml = (unsafe: string | undefined): string => {
//             if (!unsafe) return 'Не указано';
//             return unsafe
//                 .replace(/&/g, '&amp;')
//                 .replace(/</g, '&lt;')
//                 .replace(/>/g, '&gt;')
//                 .replace(/"/g, '&quot;')
//                 .replace(/'/g, '&#039;');
//         };
//
//         // Генерируем HTML для каждой небезопасной записи
//         const unsafeUrlEntries = unsafeUrls.map(entry => {
//             const { reason, suggestions } = ReportService.getUrlSafetyFeedback(
//                 entry.location.url ? entry.location.url : '',
//                 entry.location.domain ? entry.location.domain : ''
//             );
//
//             const reasonHtml = reason ? escapeHtml(reason) : 'Причина не указана';
//             const suggestionsHtml = suggestions.length > 0
//                 ? suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')
//                 : '<li>Проверьте сайт на наличие HTTPS и обновите URL.</li>';
//
//             return `
//           <div class="url-entry">
//             <h2>Запись: ${escapeHtml(entry.name ? entry.name : 'Не указан')}</h2>
//             <div class="url-details">
//             <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
//             <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
//             <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
//             <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
//             <p><strong>Пароль:</strong> ${escapeHtml(entry.credentials.password ? entry.credentials.password : 'Не указан')}</p>
//             <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
//             </div>
//             <div class="risk">
//               <strong>Почему сайт небезопасен?</strong>
//               <p>${reasonHtml}</p>
//             </div>
//             <div class="recommendations">
//               <strong>Рекомендации:</strong>
//               <ul>${suggestionsHtml}</ul>
//             </div>
//           </div>
//         `;
//         }).join('');
//
//         // Подставляем записи в шаблон
//         if (!UnsafeUrlReportTemplate) {
//             console.error('Unsafe URL report template is empty or not loaded');
//             throw new Error('Report template is not available');
//         }
//
//         const htmlContent = UnsafeUrlReportTemplate.replace('{{UNSAFE_URL_ENTRIES}}', unsafeUrlEntries);
//         const encoder = new TextEncoder();
//         const uint8Array = encoder.encode(htmlContent);
//         if (typeof selectedPath !== 'string') {
//             console.error('Selected path is not a string:', selectedPath);
//             return;
//         }
//         const fullPath = await join(selectedPath, `unsafe-url-report-${new Date().toISOString().slice(0, 10)}.html`);
//         const normalizedPath = await normalize(fullPath);
//
//         try {
//             console.log('Saving unsafe URL report to:', normalizedPath);
//             console.log('HTML content length:', htmlContent.length);
//             await writeFile(normalizedPath, uint8Array);
//             console.log('Unsafe URL report saved successfully');
//             ToastService.success(`Отчёт о небезопасных сайтах успешно создан! Найдено небезопасных URL: ${unsafeUrls.length}`);
//         } catch (err) {
//             console.error('Error saving unsafe URL report:', err);
//             ToastService.danger('Не удалось создать отчёт о небезопасных сайтах');
//             throw new Error('Failed to generate unsafe URL report');
//         }
//     }
// }

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

    // Вспомогательная функция для сохранения HTML-файла
    private static async saveReportToFile(htmlContent: string, fileName: string): Promise<void> {
        const selectedPath = await DialogService.selectPath();
        if (!selectedPath || typeof selectedPath !== 'string') {
            console.log('No path selected for saving report');
            ToastService.warning('Выберите папку для сохранения отчёта');
            return;
        }

        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(htmlContent);
        const fullPath = await join(selectedPath, `${fileName}-${new Date().toISOString().slice(0, 10)}.html`);
        const normalizedPath = await normalize(fullPath);

        try {
            console.log('Saving report to:', normalizedPath);
            await writeFile(normalizedPath, uint8Array);
            console.log('Report saved successfully');
            ToastService.success('Отчёт успешно сохранён!');
        } catch (err) {
            console.error('Error saving report:', err);
            ToastService.danger('Не удалось сохранить отчёт');
            throw new Error('Failed to save report');
        }
    }

    public static async generateWeakPasswordsReport(): Promise<string> {
        // Создаём глубокую копию записей
        const entries = JSON.parse(JSON.stringify(PasswordManagerService.getAllEntries())) as PasswordEntryInterface[];

        const passwords = await Promise.all(
            entries.map(async (entry) => {
                console.log('Before decryption:', entry.credentials.password);
                entry.credentials.password = await DecryptValue(
                    entry.credentials.password,
                    entry.credentials.encryption_iv
                );
                console.log('After decryption:', entry.credentials.password);
                return entry;
            })
        );

        const passwordStrengthService = new PasswordStrengthService();


        const weakPasswords = passwords.filter(
            (entry) => passwordStrengthService.getPasswordScore(entry.credentials.password ? entry.credentials.password : '') < 3
        );

        if (weakPasswords.length === 0) {
            console.log('Слабых паролей не найдено');
            ToastService.warning('Слабых паролей не найдено');
            return '<p>Слабых паролей не найдено.</p>';
        }

        // Экранирование HTML для безопасного вывода
        const escapeHtml = (unsafe: string | undefined): string => {
            if (!unsafe) return 'Не указано';
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        // Генерируем HTML для каждой записи
        const weakPasswordEntries = weakPasswords.map(entry => {
            const feedback = passwordStrengthService.getPasswordFeedback(entry.credentials.password || '');
            const strength = entry.credentials.passwordStrength ?? passwordStrengthService.getPasswordScore(entry.credentials.password || '');

            const warning = feedback.warning ? `Причина: ${escapeHtml(feedback.warning)}` : 'Причина: Пароль слишком простой или предсказуемый.';
            const suggestions = feedback.suggestions.length > 0
                ? feedback.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')
                : '<li>Используйте более длинный пароль с буквами, цифрами и символами.</li>';

            return `
        <div class="password-entry">
          <h2>Запись: ${escapeHtml(entry.name ? entry.name : '-')}</h2>
          <div class="password-details">
            <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
            <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
            <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
            <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
            <p><strong>Пароль:</strong> ${escapeHtml(entry.credentials.password ? entry.credentials.password : 'Не указан')}</p>
            <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
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
        if (!WeakPasswordsReportTemplate) {
            console.error('Weak passwords report template is empty or not loaded');
            throw new Error('Report template is not available');
        }

        const htmlContent = WeakPasswordsReportTemplate
            .replace('{{WEAK_PASSWORD_ENTRIES}}', weakPasswordEntries)

        return htmlContent;
    }

    public static async generateFrequentUsageReport(): Promise<string> {
        const passwordStrengthService = new PasswordStrengthService();
        const reusedEntries = await passwordStrengthService.getReusedPasswords();
        if (reusedEntries.length === 0) {
            console.log('Переиспользуемых паролей не найдено');
            ToastService.warning('Переиспользуемых паролей не найдено');
            return '<p>Переиспользуемых паролей не найдено.</p>';
        }

        const passwordGroups = new Map<string, PasswordEntryInterface[]>();
        reusedEntries.forEach((entry: PasswordEntryInterface) => {
            const password = entry.credentials.password || '';
            const group = passwordGroups.get(password) || [];
            group.push(entry);
            passwordGroups.set(password, group);
        });

        // Экранирование HTML для безопасного вывода
        const escapeHtml = (unsafe: string | undefined): string => {
            if (!unsafe) return 'Не указано';
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        const reusedPasswordGroups = Array.from(passwordGroups.entries()).map(([password, entries]) => {
            const entryCards = entries.map(entry => `
          <div class="entry-card">
            <p><strong>Название:</strong> ${escapeHtml(entry.name ? entry.name : 'Не указано')}</p>
            <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
            <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
            <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
            <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
            <p><strong>Пароль:</strong> ${escapeHtml(entry.credentials.password ? entry.credentials.password : 'Не указан')}</p>
            <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
          </div>
        `).join('');

            return `
          <div class="password-group">
            <h2>Пароль: "${escapeHtml(password)}" (используется ${entries.length} раз)</h2>
            ${entryCards}
            <div class="recommendations">
              <strong>Рекомендации:</strong>
              <ul>
                <li>Используйте уникальный пароль для каждой записи.</li>
                <li>Сгенерируйте новый сложный пароль в менеджере паролей.</li>
                <li>Обновите этот пароль на всех указанных сайтах.</li>
              </ul>
            </div>
          </div>
        `;
        }).join('') || '<p>Переиспользуемых паролей не найдено.</p>';

        // Подставляем группы в шаблон
        if (!FrequentUsageReportTemplate) {
            console.error('Frequent usage report template is empty or not loaded');
            throw new Error('Report template is not available');
        }

        const htmlContent = FrequentUsageReportTemplate
            .replace('{{REUSED_PASSWORD_GROUPS}}', reusedPasswordGroups)

        return htmlContent;
    }

    public static async generateUnsafeUrlReport(): Promise<string> {
        const entries = PasswordManagerService.getAllEntries();
        if (entries.length === 0) {
            console.log('Записей не найдено');
            ToastService.warning('Записей не найдено');
            return '<p>Записей не найдено.</p>';
        }

        const uniqueEntriesMap = new Map<string, typeof entries[0]>();
        entries.forEach(entry => {
            if (entry.id) {
                uniqueEntriesMap.set(entry.id, entry);
            }
        });

        let unsafeUrls: typeof entries;
        try {
            unsafeUrls = Array.from(uniqueEntriesMap.values()).filter(entry => {
                try {
                    return ReportService.isUrlUnsafe(
                        entry.location.url ? entry.location.url : '',
                        entry.location.domain ? entry.location.domain : ''
                    );
                } catch (innerError) {
                    console.warn('Error checking URL safety:', innerError);
                    return false;
                }
            });
        } catch (filterError) {
            console.error('Error filtering unsafe URLs:', filterError);
            ToastService.danger('Не удалось обработать небезопасные URL');
            return '<p>Ошибка при обработке небезопасных URL.</p>';
        }

        if (unsafeUrls.length === 0) {
            console.log('Небезопасных URL не найдено');
            ToastService.warning('Небезопасных URL не найдено');
            return '<p>Небезопасных URL не найдено.</p>';
        }

        // Экранирование HTML для безопасного вывода
        const escapeHtml = (unsafe: string | undefined): string => {
            if (!unsafe) return 'Не указано';
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        // Генерируем HTML для каждой небезопасной записи
        const unsafeUrlEntries = unsafeUrls.map(entry => {
            const { reason, suggestions } = ReportService.getUrlSafetyFeedback(
                entry.location.url ? entry.location.url : '',
                entry.location.domain ? entry.location.domain : ''
            );

            const reasonHtml = reason ? escapeHtml(reason) : 'Причина не указана';
            const suggestionsHtml = suggestions.length > 0
                ? suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join('')
                : '<li>Проверьте сайт на наличие HTTPS и обновите URL.</li>';

            return `
          <div class="url-entry">
            <h2>Запись: ${escapeHtml(entry.name ? entry.name : 'Не указан')}</h2>
            <div class="url-details">
              <p><strong>URL:</strong> ${escapeHtml(entry.location.url ? entry.location.url : 'Не указан')}</p>
              <p><strong>Электронная почта:</strong> ${escapeHtml(entry.credentials.email ? entry.credentials.email : 'Не указано')}</p>
              <p><strong>Имя пользователя:</strong> ${escapeHtml(entry.credentials.username ? entry.credentials.username : 'Не указано')}</p>
              <p><strong>Номер телефона:</strong> ${escapeHtml(entry.credentials.phoneNumber ? entry.credentials.phoneNumber : 'Не указано')}</p>
              <p><strong>Категория:</strong> ${escapeHtml(entry.metadata.categoryLabel ? entry.metadata.categoryLabel : 'Все')}</p>
            </div>
            <div class="risk">
              <strong>Почему сайт небезопасен?</strong>
              <p>${reasonHtml}</p>
            </div>
            <div class="recommendations">
              <strong>Рекомендации:</strong>
              <ul>${suggestionsHtml}</ul>
            </div>
          </div>
        `;
        }).join('');

        // Подставляем записи в шаблон
        if (!UnsafeUrlReportTemplate) {
            console.error('Unsafe URL report template is empty or not loaded');
            throw new Error('Report template is not available');
        }

        const htmlContent = UnsafeUrlReportTemplate
            .replace('{{UNSAFE_URL_ENTRIES}}', unsafeUrlEntries)

        return htmlContent;
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
            return false;
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
}