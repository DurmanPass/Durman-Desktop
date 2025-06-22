import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { ToastService } from '../../notification/toast.service';
import {WindowService} from "../../window.service";
import {StoreService} from "../../vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: HttpClient,
    ) {}

    async login(email: string, password: string): Promise<any> {
        const data = { email, password };
        try {
            const response = await this.http.post(ApiRoutes.LOGIN.LOGIN, data).pipe(
                map((response: any) => {
                    if (response.message) {
                        return response;
                    } else if (response.error) {
                        throw new Error(response.error);
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            ).toPromise();

            // Обработка успешного ответа
            if (response.accessToken && response.refreshToken) {
                await StoreService.save(StoreKeys.REFRESH_TOKEN, response.refreshToken);
                await StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
                await StoreService.save(StoreKeys.USER_ID, response.userId);
                await StoreService.save(StoreKeys.MASTER_PASSWORD, password);
                await StoreService.save(StoreKeys.ENABLE_TWOFA, 'false');
                await WindowService.openVaultWindow();
                setTimeout(async () => {
                    await WindowService.closeAllWindowsExVault();
                }, 100);
                ToastService.success('Вход выполнен успешно!');
            } else if (response.message === '2FA code sent to email') {
                ToastService.success('Код 2FA отправлен на ваш email!');
                await StoreService.save(StoreKeys.ENABLE_TWOFA, 'true');
            } else {
                ToastService.danger('Неизвестный ответ сервера');
            }

            return response;
        } catch (err) {
            const errorMessage = 'Ошибка при входе!';
            ToastService.danger(errorMessage);
            throw err;
        }
    }
}