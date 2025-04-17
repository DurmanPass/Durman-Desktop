import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { ToastService } from '../../notification/toast.service';
import {StoreService} from "../../vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenService {
    constructor(
        private http: HttpClient,
    ) {}

    async refreshToken(): Promise<Observable<boolean>> {
        const refreshToken = await StoreService.get(StoreKeys.REFRESH_TOKEN);
        if (!refreshToken) {
            // ToastService.danger('Refresh token отсутствует!')
            return new Observable(observer => observer.next(false));
        }

        const data = { refreshToken };

        return this.http.post(ApiRoutes.REFRESH_TOKEN.REFRESH, data).pipe(
            map((response: any) => {
                if (response.accessToken && response.message === 'Token refreshed successfully') {
                    // Сохранение нового accessToken в localStorage
                    StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
                    StoreService.save(StoreKeys.REFRESH_TOKEN, data.refreshToken);

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