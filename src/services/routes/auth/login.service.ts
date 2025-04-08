import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { ToastService } from '../../notification/toast.service';
import {WindowService} from "../../window.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(
        private http: HttpClient,
    ) {}

    login(email: string, password: string) {
        const data = { email, password };

        this.http.post(ApiRoutes.LOGIN.LOGIN, data).subscribe({
            next: (response: any) => {
                if (response.accessToken && response.message === 'Login successful' && response.refreshToken) {
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);
                    WindowService.openVaultWindow();
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