import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { ToastService } from '../../notification/toast.service';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenService {
    constructor(
        private http: HttpClient,
    ) {}

    refreshToken(): Observable<boolean> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            // ToastService.danger('Refresh token отсутствует!')
            return new Observable(observer => observer.next(false));
        }

        const data = { refreshToken };

        return this.http.post(ApiRoutes.REFRESH_TOKEN.REFRESH, data).pipe(
            map((response: any) => {
                if (response.accessToken && response.message === 'Token refreshed successfully') {
                    // Сохранение нового accessToken в localStorage
                    localStorage.setItem('accessToken', response.accessToken);
                    // Перезаписываем refreshToken (если сервер его не возвращает, оставляем старый)
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // ToastService.success('Токен успешно обновлён!')
                    return true;
                } else {
                    ToastService.danger('Ошибка при обновлении токена!')
                    return false;
                }
            }),
            map((result) => result === undefined ? false : result)
        );
    }
}