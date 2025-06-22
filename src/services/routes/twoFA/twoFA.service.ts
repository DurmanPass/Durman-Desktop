// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs/operators';
// import { ToastService } from '../../notification/toast.service';
// import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
// import { withTokenRefresh } from '../../../utils/http.utils';
// import { RefreshTokenService } from '../auth/refresh-token.service';
// import { Enable2FAResponse, Confirm2FAPayload, Confirm2FAResponse, Disable2FAResponse, Verify2FAPayload, Verify2FAResponse } from '../../../interfaces/data/twoFA.interface';
// import {StoreService} from "../../vault/store.service";
// import {StoreKeys} from "../../../shared/const/vault/store.keys";
// import {WindowService} from "../../window.service";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class TwoFAService {
//     constructor(
//         private http: HttpClient
//     ) {}
//
//     private refreshTokenService = new RefreshTokenService(this.http);
//
//     /**
//      * Инициирует включение двухфакторной аутентификации
//      * @returns Ответ с сообщением и UUID
//      * @throws Ошибка, если запрос неуспешен
//      */
//     async enable2FA(): Promise<Enable2FAResponse> {
//         return withTokenRefresh(this.http, this.refreshTokenService, headers =>
//             this.http.post(ApiRoutes.TWO_FA.ENABLE_2FA, {}, { headers }).pipe(
//                 map((response: any) => {
//                     if (response.message && response.uuid) {
//                         ToastService.success('Код для включения 2FA отправлен на ваш email!');
//                         return response as Enable2FAResponse;
//                     } else if (response.error) {
//                         throw new Error(response.error);
//                     } else {
//                         throw new Error('Некорректный ответ сервера');
//                     }
//                 })
//             )
//         );
//     }
//
//     /**
//      * Подтверждает включение двухфакторной аутентификации
//      * @param uuid UUID запроса
//      * @param code Код, отправленный на email
//      * @returns Сообщение об успешном включении
//      * @throws Ошибка, если запрос неуспешен
//      */
//     async confirmEnable2FA(uuid: string, code: string): Promise<Confirm2FAResponse> {
//         const payload: Confirm2FAPayload = { uuid, code };
//         return withTokenRefresh(this.http, this.refreshTokenService, headers =>
//             this.http.post(ApiRoutes.TWO_FA.CONFIRM_ENABLE_2FA, payload, { headers }).pipe(
//                 map((response: any) => {
//                     if (response.message) {
//                         ToastService.success('Двухфакторная аутентификация успешно включена!');
//                         return response as Confirm2FAResponse;
//                     } else if (response.error) {
//                         return response.error as Confirm2FAResponse;
//                         // throw new Error(response.error);
//                     } else {
//                         return response.error as Confirm2FAResponse;
//                         // throw new Error('Некорректный ответ сервера');
//                     }
//                 })
//             )
//         );
//     }
//
//     /**
//      * Инициирует отключение двухфакторной аутентификации
//      * @returns Ответ с сообщением и UUID
//      * @throws Ошибка, если запрос неуспешен
//      */
//     async disable2FA(): Promise<Disable2FAResponse> {
//         return withTokenRefresh(this.http, this.refreshTokenService, headers =>
//             this.http.post(ApiRoutes.TWO_FA.DISABLE_2FA, {}, { headers }).pipe(
//                 map((response: any) => {
//                     if (response.message && response.uuid) {
//                         ToastService.success('Код для отключения 2FA отправлен на ваш email!');
//                         return response as Disable2FAResponse;
//                     } else if (response.error) {
//                         throw new Error(response.error);
//                     } else {
//                         throw new Error('Некорректный ответ сервера');
//                     }
//                 })
//             )
//         );
//     }
//
//     /**
//      * Подтверждает отключение двухфакторной аутентификации
//      * @param uuid UUID запроса
//      * @param code Код, отправленный на email
//      * @returns Сообщение об успешном отключении
//      * @throws Ошибка, если запрос неуспешен
//      */
//     async confirmDisable2FA(uuid: string, code: string): Promise<Confirm2FAResponse> {
//         const payload: Confirm2FAPayload = { uuid, code };
//         return withTokenRefresh(this.http, this.refreshTokenService, headers =>
//             this.http.post(ApiRoutes.TWO_FA.CONFIRM_DISABLE_2FA, payload, { headers }).pipe(
//                 map((response: any) => {
//                     if (response.message) {
//                         ToastService.success('Двухфакторная аутентификация успешно отключена!');
//                         return response as Confirm2FAResponse;
//                     } else if (response.error) {
//                         throw new Error(response.error);
//                     } else {
//                         throw new Error('Некорректный ответ сервера');
//                     }
//                 })
//             )
//         );
//     }
//
//     /**
//      * Верифицирует двухфакторную аутентификацию
//      * @param userID ID пользователя
//      * @param code Код 2FA
//      * @param password пароль
//      * @returns Токены и сообщение об успешной верификации
//      * @throws Ошибка, если запрос неуспешен
//      */
//     async verify2FA(userID: string, code: string, password: string): Promise<Verify2FAResponse> {
//         const payload: Verify2FAPayload = { userID, code };
//         // @ts-ignore
//         return this.http.post(ApiRoutes.TWO_FA.VERIFY_2FA, payload).pipe(
//             map(async (response: any) => {
//                 if (response.accessToken && response.message && response.refreshToken) {
//                     ToastService.success('Верификация 2FA прошла успешно!');
//                     await StoreService.save(StoreKeys.REFRESH_TOKEN, response.refreshToken);
//                     await StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
//                     await StoreService.save(StoreKeys.USER_ID, userID);
//                     await StoreService.save(StoreKeys.MASTER_PASSWORD, password);
//                     await WindowService.openVaultWindow();
//                     setTimeout(async () => {
//                         await WindowService.closeAllWindowsExVault();
//                     }, 100);
//                     ToastService.success('Вход выполнен успешно!');
//                     return response as Verify2FAResponse;
//                 } else if (response.error) {
//                     throw new Error(response.error);
//                 } else {
//                     throw new Error('Некорректный ответ сервера');
//                 }
//             })
//         ).toPromise();
//     }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastService } from '../../notification/toast.service';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { withTokenRefresh } from '../../../utils/http.utils';
import { RefreshTokenService } from '../auth/refresh-token.service';
import { Enable2FAResponse, Confirm2FAPayload, Confirm2FAResponse, Disable2FAResponse, Verify2FAPayload, Verify2FAResponse } from '../../../interfaces/data/twoFA.interface';
import {StoreService} from "../../vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";
import {WindowService} from "../../window.service";

@Injectable({
    providedIn: 'root'
})
export class TwoFAService {
    constructor(
        private http: HttpClient
    ) {
    }

    private refreshTokenService = new RefreshTokenService(this.http);

    /**
     * Инициирует включение двухфакторной аутентификации
     * @returns Ответ с сообщением и UUID
     * @throws Ошибка, если запрос неуспешен
     */
    async enable2FA(): Promise<Enable2FAResponse> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(ApiRoutes.TWO_FA.ENABLE_2FA, {}, {headers}).pipe(
                map((response: any) => {
                    if (response.message && response.uuid) {
                        ToastService.success('Код для включения 2FA отправлен на ваш email!');
                        return response as Enable2FAResponse;
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
     * Подтверждает включение двухфакторной аутентификации
     * @param uuid UUID запроса
     * @param code Код, отправленный на email
     * @returns Сообщение об успешном включении
     * @throws Ошибка, если запрос неуспешен
     */
    async confirmEnable2FA(uuid: string, code: string): Promise<Confirm2FAResponse> {
        const payload: Confirm2FAPayload = {uuid, code};
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(ApiRoutes.TWO_FA.CONFIRM_ENABLE_2FA, payload, {headers}).pipe(
                map(async (response: any) => {
                    if (response.message) {
                        ToastService.success('Двухфакторная аутентификация успешно включена!');
                        return response as Confirm2FAResponse;
                    } else if (response.error) {
                        return response.error as Confirm2FAResponse;
                        // throw new Error(response.error);
                    } else {
                        return response.error as Confirm2FAResponse;
                        // throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }

    /**
     * Инициирует отключение двухфакторной аутентификации
     * @returns Ответ с сообщением и UUID
     * @throws Ошибка, если запрос неуспешен
     */
    async disable2FA(): Promise<Disable2FAResponse> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(ApiRoutes.TWO_FA.DISABLE_2FA, {}, {headers}).pipe(
                map((response: any) => {
                    if (response.message && response.uuid) {
                        ToastService.success('Код для отключения 2FA отправлен на ваш email!');
                        return response as Disable2FAResponse;
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
     * Подтверждает отключение двухфакторной аутентификации
     * @param uuid UUID запроса
     * @param code Код, отправленный на email
     * @returns Сообщение об успешном отключении
     * @throws Ошибка, если запрос неуспешен
     */
    async confirmDisable2FA(uuid: string, code: string): Promise<Confirm2FAResponse> {
        const payload: Confirm2FAPayload = {uuid, code};
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.post(ApiRoutes.TWO_FA.CONFIRM_DISABLE_2FA, payload, {headers}).pipe(
                map(async (response: any) => {
                    if (response.message) {
                        ToastService.success('Двухфакторная аутентификация успешно отключена!');
                        return response as Confirm2FAResponse;
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
     * Верифицирует двухфакторную аутентификацию
     * @param userID ID пользователя
     * @param code Код 2FA
     * @param password пароль
     * @returns Токены и сообщение об успешной верификации
     * @throws Ошибка, если запрос неуспешен
     */
    async verify2FA(userID: string, code: string, password: string): Promise<Verify2FAResponse> {
        const payload: Verify2FAPayload = {userID, code};
        // @ts-ignore
        return this.http.post(ApiRoutes.TWO_FA.VERIFY_2FA, payload).pipe(
            map(async (response: any) => {
                if (response.accessToken && response.message && response.refreshToken) {
                    ToastService.success('Верификация 2FA прошла успешно!');
                    await StoreService.save(StoreKeys.REFRESH_TOKEN, response.refreshToken);
                    await StoreService.save(StoreKeys.ACCESS_TOKEN, response.accessToken);
                    await StoreService.save(StoreKeys.USER_ID, userID);
                    await StoreService.save(StoreKeys.MASTER_PASSWORD, password);
                    await WindowService.openVaultWindow();
                    setTimeout(async () => {
                        await WindowService.closeAllWindowsExVault();
                    }, 100);
                    ToastService.success('Вход выполнен успешно!');
                    return response as Verify2FAResponse;
                } else if (response.error) {
                    throw new Error(response.error);
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            })
        ).toPromise();
    }
}