import { Injectable } from '@angular/core';
import {Category} from "../../interfaces/data/category.interface";
import {ToastService} from "../notification/toast.service";
import {CategoryService} from "../routes/category/category.service";
import {StoreService} from "../vault/store.service";
import {StoreKeys} from "../../shared/const/vault/store.keys";
@Injectable({
    providedIn: 'root'
})
export class CategoryLocalService {
    private categories: Category[] = [];

    constructor(private serverCategoryService: CategoryService) {}

    async syncCategories(): Promise<void> {
        try {
            this.categories = await this.serverCategoryService.getAllCategoryUser();
        } catch (e) {
            ToastService.danger('Не удалось синхронизировать категории с сервером!');
            console.error(e);
        }
    }

    async createCategory(name: string): Promise<{ id: string; message: string }> {
        const userId = await StoreService.get(StoreKeys.USER_ID);
        if (!userId) {
            throw new Error('User ID not found in storage');
        }
        try {
            const response = await this.serverCategoryService.createCategory(name);
            const newCategory: Category = {
                id: response.id,
                user_id: userId,
                name,
                description: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            this.categories.push(newCategory);
            return response;
        } catch (e) {
            throw e;
        }
    }

    async getCategoryById(categoryId: string): Promise<Category> {
        const localCategory = this.categories.find(c => c.id === categoryId);
        if (localCategory) {
            return localCategory;
        }
        try {
            const serverCategory = await this.serverCategoryService.getCategoryById(categoryId);
            this.categories.push(serverCategory);
            return serverCategory;
        } catch (e) {
            throw e;
        }
    }

    async updateCategory(category: Category): Promise<void> {
        try {
            await this.serverCategoryService.updateCategory(category);
            const index = this.categories.findIndex(c => c.id === category.id);
            if (index !== -1) {
                this.categories[index] = { ...category };
            } else {
                this.categories.push(category);
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteCategory(categoryId: string): Promise<void> {
        try {
            await this.serverCategoryService.deleteCategory(categoryId);
            this.categories = this.categories.filter(c => c.id !== categoryId);
        } catch (e) {
            throw e;
        }
    }

    getCategories(): Category[] {
        return [...this.categories];
    }

    getCategoryNames(): string[] {
        return [...new Set(this.categories.map(c => c.name).filter(name => name))];
    }

    addCategoryLocally(category: Category): void {
        this.categories.push(category);
    }
}