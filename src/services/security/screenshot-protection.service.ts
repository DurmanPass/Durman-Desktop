import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScreenshotProtectionService {
    private overlayElement: HTMLElement | null = null;
    private subscriptions: Subscription[] = [];

    constructor() {
        this.initializeProtection();
    }

    // Инициализация защиты
    private initializeProtection(): void {
        this.createOverlay();
        this.setupEventListeners();
    }

    // Создание оверлея для затемнения
    private createOverlay(): void {
        this.overlayElement = document.createElement('div');
        this.overlayElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: none;
      pointer-events: none;
    `;
        this.overlayElement.innerText = 'Скриншоты запрещены';
        document.body.appendChild(this.overlayElement);
    }

    // Настройка слушателей событий
    private setupEventListeners(): void {
        // Перехват Print Screen (ограниченно работает в вебе)
        this.subscriptions.push(
            fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
                if (event.key === 'PrintScreen') {
                    this.blockScreenshot();
                    event.preventDefault();
                }
            })
        );

        // Обнаружение потери фокуса (например, при запуске Lightshot)
        this.subscriptions.push(
            fromEvent(window, 'blur').subscribe(() => {
                this.blockScreenshot();
            })
        );

        // Возвращение фокуса
        this.subscriptions.push(
            fromEvent(window, 'focus').subscribe(() => {
                this.restoreContent();
            })
        );
    }

    // Блокировка скриншота
    private blockScreenshot(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'block';
        }
    }

    // Восстановление контента
    private restoreContent(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'none';
        }
    }

    // Очистка при уничтожении сервиса
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement);
        }
    }
}