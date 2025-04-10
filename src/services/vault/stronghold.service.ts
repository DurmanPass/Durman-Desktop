import { Client, Stronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir } from '@tauri-apps/api/path';
import {ToastService} from "../notification/toast.service";

export class StrongholdService {
    private static stronghold: Stronghold | null = null;
    private static client: Client | null = null;
    private static readonly VAULT_PATH = 'vault.hold'; // Имя файла Stronghold
    private static readonly CLIENT_NAME = 'auth-client'; // Имя клиента

    // Инициализация Stronghold и клиента
    private static async initStronghold(password: string): Promise<void> {
        if (!this.stronghold || !this.client) {
            try {
                const vaultPath = `${await appDataDir()}/${this.VAULT_PATH}`;
                this.stronghold = await Stronghold.load(vaultPath, password);

                try {
                    this.client = await this.stronghold.loadClient(this.CLIENT_NAME);
                } catch {
                    this.client = await this.stronghold.createClient(this.CLIENT_NAME);
                }
            } catch (e) {
                ToastService.danger('Ошибка при инициализации Stronghold!');
                throw e;
            }
        }
    }

    // Сохранение данных в хранилище Stronghold
    static async save(key: string, value: string, password: string): Promise<void> {
        await this.initStronghold(password);
        const store = this.client!.getStore();
        try {
            const data = Array.from(new TextEncoder().encode(value));
            await store.insert(key, data);
            await this.stronghold!.save(); // Сохраняем изменения
        } catch (e) {
            ToastService.danger(`Ошибка при сохранении ${key} в Stronghold!`);
            throw e;
        }
    }

    // Получение данных из хранилища Stronghold
    static async get(key: string, password: string): Promise<string | null> {
        await this.initStronghold(password);
        const store = this.client!.getStore();
        try {
            const data = await store.get(key);
            return data ? new TextDecoder().decode(new Uint8Array(data)) : null;
        } catch (e) {
            ToastService.danger(`Ошибка при получении ${key} из Stronghold!`);
            return null;
        }
    }

    // Удаление данных из хранилища Stronghold
    static async remove(key: string, password: string): Promise<void> {
        await this.initStronghold(password);
        const store = this.client!.getStore();
        try {
            await store.remove(key);
            await this.stronghold!.save(); // Сохраняем изменения
        } catch (e) {
            ToastService.danger(`Ошибка при удалении ${key} из Stronghold!`);
            throw e;
        }
    }

    // Очистка хранилища (пересоздание клиента)
    static async clear(password: string): Promise<void> {
        await this.initStronghold(password);
        try {
            this.client = await this.stronghold!.createClient(this.CLIENT_NAME); // Пересоздаём клиента
            await this.stronghold!.save();
        } catch (e) {
            ToastService.danger('Ошибка при очистке Stronghold!');
            throw e;
        }
    }

    // Проверка инициализации
    static isInitialized(): boolean {
        return !!this.stronghold && !!this.client;
    }
}