import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiRoutes} from "../../../shared/const/app/api/api.routes";
import {ToastService} from "../../notification/toast.service";

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    constructor(
        private http: HttpClient,
    ) {}

    sendEmail(email: string): Observable<any> {
        const data = { email };
        return this.http.post(ApiRoutes.REGISTER.SEND_EMAIL, data);
    }

    sendVerificationCode(uuid: string, code: string): Observable<any> {
        const data = { uuid, code };
        return this.http.post(ApiRoutes.REGISTER.VERIFY_CODE, data);
    }

    sendPassword(email: string, masterPassword: string, passwordHint: string) {
        const data = { email, masterPassword, passwordHint };

        this.http.post(ApiRoutes.REGISTER.SET_PASSWORD, data).subscribe({
            next: (response: any) => {
                if (response.message === 'User registered successfully' && response.userID) {
                    ToastService.success('Регистрация прошла успешно!')
                } else {
                    ToastService.danger(response.error, 'Ошибка при регистрации!')
                }
            },
            error: (err) => {
                const errorMessage = err.error?.error || 'Ошибка при регистрации!';
                ToastService.danger(errorMessage, 'Ошибка при регистрации!')
            }
        });
    }
}