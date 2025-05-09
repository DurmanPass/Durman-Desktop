// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { firstValueFrom } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import {ToastService} from "../notification/toast.service";
// import {AuthHeadersService} from "./auth-headers.service";
// import { throwError } from 'rxjs';
// import {ApiRoutes} from "../../shared/const/app/api/api.routes";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class IvService {
//     constructor(private http: HttpClient) {}
//
//     async generateIv(): Promise<string> {
//         const headers = await AuthHeadersService.getAuthHeaders();
//
//         const observable = this.http.get(ApiRoutes.PASSWORD.GENERATE_IV, { headers }).pipe(
//             map((response: any) => {
//                 if (response.iv) {
//                     return response.iv as string;
//                 } else {
//                     throw new Error('Некорректный ответ сервера');
//                 }
//             }),
//             catchError(err => {
//                 const errorMessage = err.error?.error || 'Ошибка при генерации вектора инициализации!';
//                 ToastService.danger(errorMessage);
//                 return throwError(() => new Error(errorMessage));
//             })
//         );
//
//         return firstValueFrom(observable);
//     }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastService } from '../notification/toast.service';
import { AuthHeadersService } from './auth-headers.service';
import { ApiRoutes } from '../../shared/const/app/api/api.routes';
import {RefreshTokenService} from "./auth/refresh-token.service";
import {withTokenRefresh} from "../../utils/http.utils";

@Injectable({
    providedIn: 'root'
})
export class IvService {
    constructor(
        private http: HttpClient,
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);

    async generateIv(): Promise<string> {
        return withTokenRefresh(this.http, this.refreshTokenService, headers =>
            this.http.get(ApiRoutes.PASSWORD.GENERATE_IV, { headers }).pipe(
                map((response: any) => {
                    if (response.iv) {
                        return response.iv as string;
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }
                })
            )
        );
    }
}