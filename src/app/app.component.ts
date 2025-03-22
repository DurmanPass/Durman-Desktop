import {ApplicationRef, Component, EnvironmentInjector} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {StartPageComponent} from "../ui/pages/start-page/start-page.component";
import {WindowService} from "../services/window.service";
import {WINDOWS_LABELS} from "../shared/enums/windows-labels.enum";
import {PasswordGeneratePageComponent} from "../ui/pages/password-generate-page/password-generate-page.component";
import {VaultPageComponent} from "../ui/pages/vault-page/vault-page.component";
import {FrozenAccountPageComponent} from "../ui/pages/frozen-account-page/frozen-account-page.component";
import {SecurityLockService} from "../services/security/security-lock.service";
import {SettingsService} from "../services/settings/app-settings.service";
import {ModalBaseComponent} from "../ui/components/modals/modal-base/modal-base.component";
import {
    PasswordDetailsModalComponent
} from "../ui/components/modals/password-details-modal/password-details-modal.component";
import {ConfirmModalComponent} from "../ui/components/modals/confirm-modal/confirm-modal.component";
import {ToastService} from "../services/notification/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StartPageComponent, PasswordGeneratePageComponent, VaultPageComponent, FrozenAccountPageComponent, ModalBaseComponent, PasswordDetailsModalComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';
  isLocked: boolean = SecurityLockService.getIsLocked();
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector) {
    ToastService.initialize(appRef, injector);
  }
  async ngOnInit(): Promise<void> {
    this.windowLabel = await WindowService.getWindowLabel();

    if(this.windowLabel === WINDOWS_LABELS.VAULT){

    }
    SecurityLockService.initialize();

    SettingsService.loadSettings();

    setInterval(() => {
      this.isLocked = SecurityLockService.getIsLocked();
    }, 1000);
  }


  unlockAccount(password: string): void {
    let isVerifyPassword = false;
    //TODO Отправить проверку пароля на backend
    if (isVerifyPassword) {
      SecurityLockService.unlock();
      this.isLocked = false;
    } else {
      alert('Неверный пароль');
    }
  }

  protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}
