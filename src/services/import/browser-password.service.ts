
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { invoke } from '@tauri-apps/api/core';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export interface BrowserPassword {
    website: string;
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class BrowserPasswordService {
    getBrowserPasswords(): Observable<BrowserPassword[]> {
        return fromPromise(
            invoke<BrowserPassword[]>('get_browser_passwords').catch(error => {
                throw new Error(`Failed to get browser passwords: ${error}`);
            })
        );
    }
}