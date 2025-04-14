import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { ToastService } from '../../notification/toast.service';
import {WindowService} from "../../window.service";
import {StoreService} from "../../vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: HttpClient,
    ) {}

    async login(email: string, password: string) {
        const data = { email, password };

        this.http.post(ApiRoutes.LOGIN.LOGIN, data).subscribe({
            next: async (response: any) => {
                if (response.accessToken && response.refreshToken) {
                    await StoreService.save(StoreKeys.REFRESH_TOKEN, response.refreshToken);
                    await StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
                    await StoreService.save(StoreKeys.MASTER_PASSWORD, password);
                    await WindowService.openVaultWindow();
                    ToastService.success('Вход выполнен успешно!')
                } else {
                    ToastService.danger('Ошибка при входе!')
                }
            },
            error: (err) => {
                const errorMessage = err.error?.error || 'Ошибка при входе!';
                ToastService.danger(errorMessage,'Ошибка при входе!')
            }
        });
    }
}