import { Injectable } from '@angular/core';
import {open} from "@tauri-apps/plugin-dialog";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    async selectPath(directory: boolean = true, multiple: boolean = false): Promise<string | string[] | null> {
        try {
            const selectedPath = await open({
                directory,
                multiple
            });

            return selectedPath ? selectedPath : null;
        } catch (error) {
            return null;
        }
    }
}
