// import { ApplicationRef, ComponentRef, Injectable, createComponent, EnvironmentInjector } from '@angular/core';
// import { ModalBaseComponent } from '../../ui/components/modals/modal-base/modal-base.component';
// import { ConfirmModalComponent } from '../../ui/components/modals/confirm-modal/confirm-modal.component';
//
// @Injectable({
//     providedIn: 'root'
// })
// export class ConfirmModalService {
//     // Сохраняем injector для доступа к Angular DI в статическом методе
//     private static environmentInjector: EnvironmentInjector;
//
//     constructor(injector: EnvironmentInjector) {
//         ConfirmModalService.environmentInjector = injector;
//     }
//
//     static async createConfirmModal(
//         title: string,
//         description: string,
//         options: {
//             requirePassword?: boolean;
//             requireEmailCode?: boolean;
//         } = {}
//     ): Promise<boolean> {
//         // Проверяем, что injector инициализирован
//         if (!ConfirmModalService.environmentInjector) {
//             throw new Error('ConfirmModalService not initialized. Ensure the service is provided.');
//         }
//
//         // Создаём ModalBaseComponent
//         const modalBaseRef = createComponent(ModalBaseComponent, {
//             environmentInjector: ConfirmModalService.environmentInjector
//         });
//
//         // Создаём ConfirmModalComponent
//         const confirmModalRef = createComponent(ConfirmModalComponent, {
//             environmentInjector: ConfirmModalService.environmentInjector
//         });
//
//         // Настраиваем входные параметры ConfirmModalComponent
//         confirmModalRef.instance.title = title;
//         confirmModalRef.instance.description = description;
//         confirmModalRef.instance.requirePassword = options.requirePassword ?? false;
//         confirmModalRef.instance.requireEmailCode = options.requireEmailCode ?? false;
//
//         // Добавляем ConfirmModalComponent в ModalBaseComponent (как дочерний)
//         modalBaseRef.location.nativeElement.appendChild(confirmModalRef.location.nativeElement);
//
//         // Добавляем ModalBaseComponent в DOM
//         document.body.appendChild(modalBaseRef.location.nativeElement);
//
//         // Привязываем представления к Angular
//         const appRef = ConfirmModalService.environmentInjector.get(ApplicationRef);
//         appRef.attachView(modalBaseRef.hostView);
//         appRef.attachView(confirmModalRef.hostView);
//
//         // Возвращаем результат через Promise
//         return new Promise<boolean>((resolve) => {
//             confirmModalRef.instance.result.subscribe((result: boolean) => {
//                 resolve(result);
//                 // Уничтожаем компоненты
//                 modalBaseRef.destroy();
//                 confirmModalRef.destroy();
//             });
//         }).finally(() => {
//             // Очищаем DOM и представления
//             appRef.detachView(modalBaseRef.hostView);
//             appRef.detachView(confirmModalRef.hostView);
//             document.body.removeChild(modalBaseRef.location.nativeElement);
//         });
//     }
// }

import { ApplicationRef, ComponentRef, Injectable, createComponent, EnvironmentInjector } from '@angular/core';
import { ModalBaseComponent } from '../../ui/components/modals/modal-base/modal-base.component';
import { ConfirmModalComponent } from '../../ui/components/modals/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
})
// export class ConfirmModalService {
//     /**
//      * Creates a confirmation modal dynamically and returns the user's choice.
//      * @param injector EnvironmentInjector from the component's context
//      * @param title Modal title
//      * @param description Modal description
//      * @param options Additional options for password and email code requirements
//      * @returns Promise resolving to true (confirm) or false (cancel)
//      */
//     static async createConfirmModal(
//         injector: EnvironmentInjector,
//         title: string,
//         description: string,
//         options: {
//             requirePassword?: boolean;
//             requireEmailCode?: boolean;
//         } = {}
//     ): Promise<boolean> {
//         // Создаём ModalBaseComponent
//         const modalBaseRef = createComponent(ModalBaseComponent, {
//             environmentInjector: injector
//         });
//
//         // Создаём ConfirmModalComponent
//         const confirmModalRef = createComponent(ConfirmModalComponent, {
//             environmentInjector: injector
//         });
//
//         // Настраиваем входные параметры ConfirmModalComponent
//         confirmModalRef.instance.title = title;
//         confirmModalRef.instance.description = description;
//         confirmModalRef.instance.requirePassword = options.requirePassword ?? false;
//         confirmModalRef.instance.requireEmailCode = options.requireEmailCode ?? false;
//
//         // Добавляем ConfirmModalComponent в ModalBaseComponent (как дочерний)
//         modalBaseRef.location.nativeElement.appendChild(confirmModalRef.location.nativeElement);
//
//         // Добавляем ModalBaseComponent в DOM
//         document.body.appendChild(modalBaseRef.location.nativeElement);
//
//         // Привязываем представления к Angular
//         const appRef = injector.get(ApplicationRef);
//         appRef.attachView(modalBaseRef.hostView);
//         appRef.attachView(confirmModalRef.hostView);
//
//         // Возвращаем результат через Promise
//         return new Promise<boolean>((resolve) => {
//             confirmModalRef.instance.result.subscribe((result: boolean) => {
//                 resolve(result);
//                 // Уничтожаем компоненты
//                 modalBaseRef.destroy();
//                 confirmModalRef.destroy();
//             });
//         }).finally(() => {
//             // Очищаем DOM и представления
//             appRef.detachView(modalBaseRef.hostView);
//             appRef.detachView(confirmModalRef.hostView);
//             if (modalBaseRef.location.nativeElement.parentNode) {
//                 document.body.removeChild(modalBaseRef.location.nativeElement);
//             }
//         });
//     }
// }

export class ConfirmModalService {
    static async createConfirmModal(
        injector: EnvironmentInjector,
        title: string,
        description: string,
        options: {
            requirePassword?: boolean;
            requireEmailCode?: boolean;
        } = {}
    ): Promise<boolean> {
        const modalBaseRef = createComponent(ModalBaseComponent, {
            environmentInjector: injector
        });

        const confirmModalRef = createComponent(ConfirmModalComponent, {
            environmentInjector: injector
        });

        confirmModalRef.instance.title = title;
        confirmModalRef.instance.description = description;
        confirmModalRef.instance.requirePassword = options.requirePassword ?? false;
        confirmModalRef.instance.requireEmailCode = options.requireEmailCode ?? false;

        modalBaseRef.location.nativeElement.appendChild(confirmModalRef.location.nativeElement);
        document.body.appendChild(modalBaseRef.location.nativeElement);

        const modalElement = modalBaseRef.location.nativeElement;
        Object.assign(modalElement.style, {
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            top: '0',
            left: '0',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.8)'
        });

        const appRef = injector.get(ApplicationRef);
        appRef.attachView(modalBaseRef.hostView);
        appRef.attachView(confirmModalRef.hostView);

        return new Promise<boolean>((resolve) => {
            confirmModalRef.instance.result.subscribe((result: boolean) => {
                resolve(result);
                modalBaseRef.destroy();
                confirmModalRef.destroy();
            });
        }).finally(() => {
            appRef.detachView(modalBaseRef.hostView);
            appRef.detachView(confirmModalRef.hostView);
            if (modalBaseRef.location.nativeElement.parentNode) {
                document.body.removeChild(modalBaseRef.location.nativeElement);
            }
        });
    }
}