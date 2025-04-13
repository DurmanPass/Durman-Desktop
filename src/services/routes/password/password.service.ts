import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {RefreshTokenService} from "../auth/refresh-token.service";
import {CreatePasswordResponse, PasswordBackendEntry} from "../../../interfaces/data/passwordEntry.interface";
import {withTokenRefresh} from "../../../utils/http.utils";
import {ApiRoutes} from "../../../shared/const/app/api/api.routes";
import {ToastService} from "../../notification/toast.service";
@Injectable({
    providedIn: 'root'
})
export class PasswordService {
    constructor(
        private http: HttpClient,
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);

    async createPassword(password: PasswordBackendEntry): Promise<CreatePasswordResponse> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(ApiRoutes.PASSWORD.CREATE_PASSWORD, password, { headers }).pipe(
                map((response: any) => {
                    if (response.id && response.message) {
                        ToastService.success('Пароль успешно создан!');
                        return response as CreatePasswordResponse;
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    async getAllPasswords(): Promise<PasswordBackendEntry[]> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(ApiRoutes.PASSWORD.GET_ALL_PASSWORDS, { headers }).pipe(
                map((response: any) => {
                    if (Array.isArray(response)) {
                        return response as PasswordBackendEntry[];
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    async getPasswordById(passwordId: string): Promise<PasswordBackendEntry> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(ApiRoutes.PASSWORD.GET_PASSWORD_BY_ID(passwordId), { headers }).pipe(
                map((response: any) => {
                    if (response.id) {
                        return response as PasswordBackendEntry;
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    async updatePassword(passwordId: string, password: PasswordBackendEntry): Promise<void> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.put(ApiRoutes.PASSWORD.UPDATE_PASSWORD(passwordId), password, { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Пароль успешно обновлён!');
                        return;
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    async deletePassword(passwordId: string): Promise<void> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.delete(ApiRoutes.PASSWORD.DELETE_PASSWORD(passwordId), { headers }).pipe(
                map((response: any) => {
                    if (response.message) {
                        ToastService.success('Пароль успешно удалён!');
                        return;
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}