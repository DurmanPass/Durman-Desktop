import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastService } from '../../notification/toast.service';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { withTokenRefresh } from '../../../utils/http.utils';
import { RefreshTokenService } from '../auth/refresh-token.service';
import {Profile} from "../../../interfaces/data/profile/profile.interface";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(
        private http: HttpClient
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);

    /**
     * Получает профиль пользователя
     */
    async getProfile(): Promise<Profile> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(ApiRoutes.USER.GET_PROFILE, { headers }).pipe(
                map((response: any) => {
                    if (response.unique_id && response.email) {
                        return response as Profile;
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
     * Удаляет профиль пользователя
     */
    async deleteProfile(): Promise<string> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.delete(ApiRoutes.USER.DELETE_PROFILE, { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Профиль успешно удалён!');
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