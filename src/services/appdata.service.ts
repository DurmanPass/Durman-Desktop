import { invoke } from '@tauri-apps/api/core';
import { ToastService } from './notification/toast.service';
import {TauriCommands} from "../shared/const/app/tauri/tauri.commands";

export class AppdataService {
    static async ensureDurmanpassDir(): Promise<void> {
        try {
            await invoke(TauriCommands.APP_DATA_SERVICE.CREATE_DURMANPASS_DIR);
        } catch (error) {
            throw error;
        }
    }
}