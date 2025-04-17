// window.service.ts
import { Injectable } from '@angular/core';
import { invoke} from "@tauri-apps/api/core";
import {TauriCommands} from "../shared/const/app/tauri/tauri.commands";

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    static async getWindowLabel(): Promise<string> {
        return await invoke(TauriCommands.WINDOW_SERVICE.GET_WINDOW_LABEL);
    }

    static async openPasswordGenerateWindow(){
        try {
            await invoke(TauriCommands.WINDOW_SERVICE.CREATE_PASSWORD_GENERATE_PAGE);
        } catch (error) {
        }
    }

    static async openVaultWindow(){
        try {
            await invoke(TauriCommands.WINDOW_SERVICE.CREATE_VAULT_WINDOW);
        } catch (error) {
        }
    }

    static async closeAllWindows(){
        await invoke(TauriCommands.WINDOW_SERVICE.CLOSE_ALL_WINDOWS);
    }

    static async closeAllWindowsExVault(){
        await invoke(TauriCommands.WINDOW_SERVICE.CLOSE_ALL_WINDOWS_EXCEPT_VAULT_WINDOW);
    }

    static async closeCurrentWindow(): Promise<void> {
        await invoke(TauriCommands.WINDOW_SERVICE.CLOSE_CURRENT_WINDOW);
    }
}
