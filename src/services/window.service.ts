// window.service.ts
import { Injectable } from '@angular/core';
import { invoke} from "@tauri-apps/api/core";
import {WebviewWindow} from "@tauri-apps/api/webviewWindow";

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    static async getWindowLabel(): Promise<string> {
        return await invoke('get_window_label');
    }

    static async openPasswordGenerateWindow(){
        try {
            await invoke('create_password_generate_window');
        } catch (error) {
        }
    }
}
