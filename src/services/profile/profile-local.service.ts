import { Injectable } from '@angular/core';
import { StoreService } from '../vault/store.service';
import { StoreKeys } from '../../shared/const/vault/store.keys';
import {Profile} from "../../interfaces/data/profile/profile.interface";
import {ProfileService} from "../routes/profile/profile.service";

@Injectable({
    providedIn: 'root'
})
export class ProfileLocalService {
    private profile: Profile | null = null;

    constructor(
        private profileService: ProfileService,
    ) {}

    /**
     * Синхронизирует профиль с сервером
     */
    async syncProfile(): Promise<void> {
        try {
            this.profile = await this.profileService.getProfile();
        } catch (e) {
            console.error('Не удалось синхронизировать профиль с сервером:', e);
        }
    }

    /**
     * Получает профиль
     * @returns Локальный или серверный профиль
     * @throws Ошибка, если профиль не найден
     */
    async getProfile(): Promise<Profile> {
        if (this.profile) {
            return this.profile;
        }
        try {
            const serverProfile = await this.profileService.getProfile();
            this.profile = serverProfile;
            return serverProfile;
        } catch (e) {
            throw e instanceof Error ? e : new Error('Не удалось получить профиль');
        }
    }

    /**
     * Удаляет профиль
     */
    async deleteProfile(): Promise<void> {
        try {
            const message = await this.profileService.deleteProfile();
            this.profile = null;
            await StoreService.remove(StoreKeys.USER_ID);
        } catch (e) {
            throw e instanceof Error ? e : new Error('Не удалось удалить профиль');
        }
    }

    async deleteData(){
        try {
            await this.profileService.deleteProfileData();
        } catch (e) {
        }
    }

    /**
     * Возвращает локальный профиль
     * @returns Локальный профиль или null
     */
    getLocalProfile(): Profile | null {
        return this.profile ? { ...this.profile } : null;
    }

    /**
     * Устанавливает профиль локально
     * @param profile Данные профиля
     */
    setLocalProfile(profile: Profile): void {
        this.profile = { ...profile };
    }
}