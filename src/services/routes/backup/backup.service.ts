import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { ToastService } from '../../notification/toast.service';
import { ApiRoutes } from '../../../shared/const/app/api/api.routes';
import { withTokenRefresh } from '../../../utils/http.utils';
import { RefreshTokenService } from '../auth/refresh-token.service';
import {CryptoFileService} from "../../crypto/crypto-file.service";
import {StoreService} from "../../vault/store.service";
import {StoreKeys} from "../../../shared/const/vault/store.keys";

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    constructor(
        private http: HttpClient,
        private cryptoService: CryptoFileService,
    ) {}

    private refreshTokenService = new RefreshTokenService(this.http);

    /**
     * Выполняет резервное копирование паролей: получает файл, шифрует его и сохраняет на компьютер.
     */
    async backupPasswords(): Promise<void> {
        try {
            // Получаем мастер-пароль
            const masterPassword = await StoreService.get(StoreKeys.MASTER_PASSWORD);
            if (!masterPassword) {
                throw new Error('Мастер-пароль не найден');
            }

            // Выполняем GET-запрос для получения файла
            const fileBlob = await withTokenRefresh(this.http, this.refreshTokenService, headers =>
                this.http.get(ApiRoutes.BACKUPS.PASSWORDS_BACKUPS, { headers, responseType: 'blob' }).pipe(
                    map((response: Blob) => {
                        if (response.size > 0) {
                            return response;
                        } else {
                            throw new Error('Получен пустой файл');
                        }
                    })
                )
            );

            // const timestamp2 = new Date().toISOString().replace(/[:.]/g, '-');
            // const originalFileName = `passwords-backup-original-${timestamp2}.json`;
            //
            // const originalFilePath = await save({
            //     defaultPath: originalFileName,
            //     filters: [{ name: 'JSON Files', extensions: ['json'] }]
            // });
            //
            // if (originalFilePath) {
            //     const arrayBuffer = await fileBlob.arrayBuffer();
            //     await writeFile(originalFilePath, new Uint8Array(arrayBuffer));
            //     console.log('Исходный файл сохранён:', originalFilePath);
            //     ToastService.success('Исходный файл успешно сохранён для тестирования!');
            // } else {
            //     console.warn('Сохранение исходного файла отменено пользователем');
            // }

            // console.log(fileBlob);

            // Шифруем файл
            const encryptedBlob = await this.cryptoService.encryptFile(fileBlob, masterPassword);

            // Генерируем имя файла с временной меткой
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const defaultFileName = `passwords-backup-${timestamp}`;

            // Открываем диалоговое окно для выбора пути сохранения
            const filePath = await save({
                defaultPath: defaultFileName,
                filters: [{ name: 'Encrypted Files', extensions: ['durmanpass'] }]
            });

            if (!filePath) {
                throw new Error('Пользователь отменил сохранение файла');
            }

            // Читаем зашифрованный Blob как ArrayBuffer и записываем в файл
            const arrayBuffer = await encryptedBlob.arrayBuffer();
            await writeFile(filePath, new Uint8Array(arrayBuffer));

            ToastService.success('Резервная копия успешно создана и сохранена!');
        } catch (error) {
            ToastService.danger(`Ошибка при создании резервной копии: ${error}`);
            throw error;
        }
    }
}