export class SecurityLockService {
    private static isLocked: boolean = false;
    // private static readonly LOCK_TIMEOUT_MS: number = 3 * 60 * 1000;
    private static readonly LOCK_TIMEOUT_MS: number = 300 * 60 * 1000;
    private static timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Инициализация сервиса
    public static initialize(): void {
        this.resetTimer();
        this.setupEventListeners();
    }

    // Получение состояния блокировки
    public static getIsLocked(): boolean {
        return this.isLocked;
    }

    // Разблокировка (например, после ввода пароля)
    public static unlock(): void {
        this.isLocked = false;
        this.resetTimer();
    }

    // Сброс таймера (вызывается при активности)
    private static resetTimer(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            this.lock();
        }, this.LOCK_TIMEOUT_MS);
    }

    // Блокировка приложения
    private static lock(): void {
        this.isLocked = true;
        console.log('Приложение заблокировано из-за неактивности');
    }

    // Настройка слушателей событий
    private static setupEventListeners(): void {
        // Событие потери фокуса вкладки (переключение на другую вкладку или свёртывание окна)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.resetTimer(); // Запускаем таймер, когда вкладка становится невидимой
            } else {
                if (!this.isLocked) {
                    this.resetTimer(); // Сбрасываем таймер, если вкладка снова активна и не заблокирована
                }
            }
        });

        // События активности пользователя (движение мыши, нажатие клавиш)
        ['mousemove', 'keydown', 'click'].forEach(event => {
            document.addEventListener(event, () => {
                if (!this.isLocked) {
                    this.resetTimer(); // Сбрасываем таймер при активности
                }
            });
        });

        // Событие потери фокуса окна (например, свёртывание программы)
        window.addEventListener('blur', () => {
            this.resetTimer();
        });

        // Событие возвращения фокуса
        window.addEventListener('focus', () => {
            if (!this.isLocked) {
                this.resetTimer();
            }
        });
    }
}