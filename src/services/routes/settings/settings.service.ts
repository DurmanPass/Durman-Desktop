import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastService } from '../../notification/toast.service';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { withTokenRefresh } from '../../../utils/http.utils';
import { RefreshTokenService } from '../auth/refresh-token.service';
import { ServerSettings } from '../../../interfaces/data/appSettings.interface';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    constructor(
        private http: HttpClient
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);

    /**
     * Получает настройки пользователя
     * @returns Настройки пользователя
     * @throws Ошибка, если запрос неуспешен
     */
    async getSettings(): Promise<ServerSettings> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(ApiRoutes.SETTINGS.GET_SETTINGS, { headers }).pipe(
                map((response: any) => {
                    if (response.hide_password_strength_widget !== undefined && response.lock_timeout_min !== undefined) {
                        return response as ServerSettings;
                    } else if (response.error) {
                        throw new Error(response.error);
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Обновляет все настройки пользователя
     * @param settings Новые настройки
     * @returns Сообщение об успешном обновлении
     * @throws Ошибка, если запрос неуспешен
     */
    async updateSettings(settings:ServerSettings): Promise<string> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.put(ApiRoutes.SETTINGS.UPDATE_SETTINGS, settings, { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        // ToastService.success('Настройки успешно обновлены!');
                        return response.message as string;
                    } else if (response.error) {
                        throw new Error(response.error);
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Частично обновляет настройки пользователя
     * @param settings Частичные настройки
     * @returns Сообщение об успешном обновлении
     * @throws Ошибка, если запрос неуспешен
     */
    async patchSettings(settings: Partial<ServerSettings>): Promise<string> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.patch(ApiRoutes.SETTINGS.PATCH_SETTINGS, settings, { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Настройки успешно обновлены!');
                        return response.message as string;
                    } else if (response.error) {
                        throw new Error(response.error);
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}