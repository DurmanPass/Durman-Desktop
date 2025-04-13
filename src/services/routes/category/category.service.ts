import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs'; // Импортируем firstValueFrom
import { ToastService } from '../../notification/toast.service';
import { Category } from '../../../interfaces/data/category.interface';
import {AuthHeadersService} from "../auth-headers.service";
import {ApiRoutes} from "../../../shared/const/app/api/api.routes";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(private http: HttpClient) {}

    async createCategory(name: string): Promise<{ id: string; message: string }> {
        const headers = await AuthHeadersService.getAuthHeaders();
        const body = { name };

        const observable = this.http.post(ApiRoutes.CATEGORY.CREATE_CATEGORY, body, { headers }).pipe(
            map((response: any) => {
                if (response.id && response.message) {
                    ToastService.success('Категория успешно создана!');
                    return response as { id: string; message: string };
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            }),
            catchError(err => {
                const errorMessage = err.error?.error || 'Ошибка при создании категории!';
                ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );

        return firstValueFrom(observable);
    }

    async getAllCategoryUser(): Promise<Category[]> {
        const headers = await AuthHeadersService.getAuthHeaders();

        const observable = this.http.get(ApiRoutes.CATEGORY.GET_ALL_CATEGORY_USER, { headers }).pipe(
            map((response: any) => {
                if (Array.isArray(response)) {
                    return response as Category[];
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            }),
            catchError(err => {
                const errorMessage = err.error?.error || 'Ошибка при получении категорий!';
                ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );

        return firstValueFrom(observable);
    }

    async getCategoryById(categoryId: string): Promise<Category> {
        const headers = await AuthHeadersService.getAuthHeaders();

        const observable = this.http.get(ApiRoutes.CATEGORY.GET_CATEGORY_BY_ID(categoryId), { headers }).pipe(
            map((response: any) => {
                if (response.id) {
                    return response as Category;
                } else {
                    throw new Error('Некорректный ответ сервера');
                }
            }),
            catchError(err => {
                const errorMessage = err.error?.error || 'Ошибка при получении категории!';
                ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );

        return firstValueFrom(observable);
    }

    async updateCategory(category: Category): Promise<void> {
        const headers = await AuthHeadersService.getAuthHeaders();

        const observable = this.http.put(ApiRoutes.CATEGORY.UPDATE_CATEGORY(category.id), {name: category.name}, { headers }).pipe(
            map(() => {
                ToastService.success('Категория успешно обновлена!');
            }),
            catchError(err => {
                console.log(category);
                const errorMessage = err.error?.error || 'Ошибка при обновлении категории!';
                console.log(err);
                ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );

        return firstValueFrom(observable);
    }

    async deleteCategory(categoryId: string): Promise<void> {
        const headers = await AuthHeadersService.getAuthHeaders();

        const observable = this.http.delete(ApiRoutes.CATEGORY.DELETE_CATEGORY(categoryId), { headers }).pipe(
            map(() => {
                ToastService.success('Категория успешно удалена!');
            }),
            catchError(err => {
                const errorMessage = err.error?.error || 'Ошибка при удалении категории!';
                ToastService.danger(errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );

        return firstValueFrom(observable);
    }
}