import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FocusProtectionService {
    private overlayElement: HTMLElement | null = null;
    private subscriptions: Subscription[] = [];

    constructor() {
        this.initializeProtection();
    }

    private initializeProtection(): void {
        this.createOverlay();
        this.setupEventListeners();
    }

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
      color: #fff;
      text-align: center;
      font-size: 24px;
      line-height: 100vh;
    `;
        this.overlayElement.innerText = 'Контент скрыт для защиты данных';
        document.body.appendChild(this.overlayElement);
    }

    private setupEventListeners(): void {
        // Реакция на PrintScreen (ограниченно в вебе)
        this.subscriptions.push(
            fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
                if (event.key === 'PrintScreen') {
                    this.hideContent();
                    event.preventDefault();
                }
            })
        );

        // Потеря фокуса окна
        this.subscriptions.push(
            fromEvent(window, 'blur').subscribe(() => {
                this.hideContent();
            })
        );

        // Возвращение фокуса
        this.subscriptions.push(
            fromEvent(window, 'focus').subscribe(() => {
                this.showContent();
            })
        );
    }

    private hideContent(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'block';
        }
    }

    private showContent(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'none';
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement);
        }
    }
}