import { Injectable } from '@angular/core';
import {invoke} from "@tauri-apps/api/core";
import {TauriCommands} from "../../shared/const/app/tauri/tauri.commands";

@Injectable({
    providedIn: 'root'
})
export class ScreenshotBlockingService {
    constructor() {
        this.initializeScreenshotBlocking().then();
    }

    private async initializeScreenshotBlocking(): Promise<void> {
        try {
            await invoke(TauriCommands.SCREENSHOT_PROTECTION_SERVICE.INITIALIZE_SCREENSHOT_BLOCKING);
        } catch (error) {
        }
    }
}