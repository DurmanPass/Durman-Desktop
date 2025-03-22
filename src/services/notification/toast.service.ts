import { ApplicationRef, ComponentRef, EnvironmentInjector, createComponent } from '@angular/core';
import {ToastComponent} from "../../ui/components/notifications/toast/toast.component";

interface ToastOptions {
    type: 'success' | 'warning' | 'danger';
    title?: string;
    description?: string;
    duration?: number;
}

export class ToastService {
    private static toastContainer: HTMLElement | null = null;
    private static toasts: ComponentRef<ToastComponent>[] = [];
    private static appRef: ApplicationRef | null = null;
    private static injector: EnvironmentInjector | null = null;

    /**
     * Инициализация сервиса (вызывается один раз в корневом компоненте)
     */
    public static initialize(appRef: ApplicationRef, injector: EnvironmentInjector): void {
        this.appRef = appRef;
        this.injector = injector;

        // Создаём контейнер для тостов, если его ещё нет
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    /**
     * Показывает уведомление
     */
    public static show(options: ToastOptions): void {
        if (!this.appRef || !this.injector || !this.toastContainer) {
            console.error('ToastService не инициализирован. Вызовите ToastService.initialize в корневом компоненте.');
            return;
        }

        const { type, title, description, duration = 3000 } = options;

        // Создаём компонент динамически
        const toastRef = createComponent(ToastComponent, {
            environmentInjector: this.injector,
            hostElement: this.toastContainer
        });

        // Устанавливаем входные параметры
        toastRef.instance.type = type;
        toastRef.instance.title = title;
        toastRef.instance.description = description;
        toastRef.instance.duration = duration;

        // Привязываем компонент к Angular для обновления
        this.appRef.attachView(toastRef.hostView);
        this.toasts.push(toastRef);

        // Удаляем тост после окончания длительности
        setTimeout(() => {
            this.removeToast(toastRef);
        }, duration + 300); // +300 мс для анимации
    }

    public static success(description?: string, title?: string): void {
        this.show({ type: 'success', title, description });
    }

    public static warning(description?: string, title?: string): void {
        this.show({ type: 'warning', title, description });
    }

    public static danger(description?: string, title?: string): void {
        this.show({ type: 'danger', title, description });
    }

    private static removeToast(toastRef: ComponentRef<ToastComponent>): void {
        if (!this.appRef) return;

        toastRef.instance.isVisible = false;
        setTimeout(() => {
            const index = this.toasts.indexOf(toastRef);
            if (index !== -1) {
                if(this.appRef){
                    this.appRef.detachView(toastRef.hostView);
                }
                toastRef.destroy();
                this.toasts.splice(index, 1);
            }
        }, 300); // Время для анимации исчезновения
    }

    public static clearAll(): void {
        this.toasts.forEach(toast => this.removeToast(toast));
    }
}