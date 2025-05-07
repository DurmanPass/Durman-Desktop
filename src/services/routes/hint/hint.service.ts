import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastService } from '../../notification/toast.service';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { RequestHintPayload, RequestHintResponse, GetHintPayload, GetHintResponse } from '../../../interfaces/data/hint.interface';

@Injectable({
    providedIn: 'root'
})
export class HintService {
    constructor(
        private http: HttpClient
    ) {}

    /**
     * Запрашивает подсказку для пароля по email
     * @param email Email пользователя
     */
    async requestHint(email: string): Promise<RequestHintResponse> {
        const payload: RequestHintPayload = { email };
        // @ts-ignore
        return this.http.post(ApiRoutes.HINT.REQUEST_HINT, payload).pipe(
            map((response: any) => {
                if (response.message && response.uuid) {
                    ToastService.success('Код отправлен на ваш email!');
                    return response as RequestHintResponse;
                } else if (response.error) {
                    throw new Error(response.error);
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            })
        ).toPromise();
    }

    /**
     * Получает подсказку для пароля по UUID и коду
     * @param uuid UUID запроса
     * @param code Код, отправленный на email
     */
    async getHint(uuid: string, code: string): Promise<GetHintResponse> {
        const payload: GetHintPayload = { uuid, code };
        // @ts-ignore
        return this.http.post(ApiRoutes.HINT.GET_HINT, payload).pipe(
            map((response: any) => {
                if (response.password_hint) {
                    ToastService.success('Подсказка успешно получена!');
                    return response as GetHintResponse;
                } else if (response.error) {
                    throw new Error(response.error);
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            })
        ).toPromise();
    }
}