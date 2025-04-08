import { Injectable, ApplicationRef, EnvironmentInjector, createComponent, ComponentRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { FocusOverlayComponent } from '../../ui/components/overlay/focus-overlay/focus-overlay.component';

@Injectable({
    providedIn: 'root'
})
export class FocusProtectionService {
    private overlayRef: ComponentRef<FocusOverlayComponent> | null = null;
    private subscriptions: Subscription[] = [];
    private isOverlayVisible = false;

    constructor(
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector
    ) {
        this.initializeProtection();
    }

    private initializeProtection(): void {
        this.createOverlay(); // Создаём оверлей при инициализации
        this.setupEventListeners();
    }

    private createOverlay(): void {
        if (!this.overlayRef) {
            this.overlayRef = createComponent(FocusOverlayComponent, {
                environmentInjector: this.injector
            });
            document.body.appendChild(this.overlayRef.location.nativeElement);
            this.overlayRef.instance.overlayClicked.subscribe(() => this.showContent());
            this.appRef.attachView(this.overlayRef.hostView);
            // Устанавливаем начальное состояние как скрытое
            this.overlayRef.location.nativeElement.style.display = 'none';
        }
    }

    private setupEventListeners(): void {
        // Реакция на PrintScreen
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
        if (this.overlayRef && !this.isOverlayVisible) {
            this.overlayRef.location.nativeElement.style.display = 'block';
            this.isOverlayVisible = true;
        }
    }

    private showContent(): void {
        if (this.overlayRef && this.isOverlayVisible) {
            this.overlayRef.location.nativeElement.style.display = 'none';
            this.isOverlayVisible = false;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.overlayRef) {
            this.appRef.detachView(this.overlayRef.hostView);
            this.overlayRef.destroy();
            this.overlayRef = null;
        }
    }
}