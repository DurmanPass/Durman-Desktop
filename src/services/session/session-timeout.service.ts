import { Injectable } from '@angular/core';
import { WindowService } from '../window.service';

@Injectable({
    providedIn: 'root'
})
export class SessionTimeoutService {
    private readonly TIMEOUT_DURATION = 12 * 60 * 60 * 1000; // 12 часов в миллисекундах
    private isTimerStarted = false;

    constructor() {}

    startSessionTimer(): void {
        if (this.isTimerStarted) {
            console.log('Session timer already started');
            return;
        }

        this.isTimerStarted = true;
        console.log('Starting session timer for 12 hours');

        setTimeout(async () => {
            console.log('Session timeout reached. Closing all windows.');
            await WindowService.closeAllWindows();
        }, this.TIMEOUT_DURATION);
    }

    isSessionTimerStarted(): boolean {
        return this.isTimerStarted;
    }
}