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
import {FocusProtectionService} from "../services/security/focus-protection.service";
import {ScreenshotBlockingService} from "../services/security/screenshot-blocking.service";
import {AppdataService} from "../services/appdata.service";
import {StoreService} from "../services/vault/store.service";
import {IvService} from "../services/routes/iv.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CryptoAesGcmService} from "../services/crypto/crypto-aes-gcm.service";
import {PasswordService} from "../services/routes/password/password.service";
import {PasswordManagerService} from "../services/password/password-manager.service";
import {CategoryService} from "../services/routes/category/category.service";
import {CategoryLocalService} from "../services/category/category-local.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StartPageComponent, PasswordGeneratePageComponent, VaultPageComponent, FrozenAccountPageComponent, ModalBaseComponent, PasswordDetailsModalComponent, ConfirmModalComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';
  isLocked: boolean = SecurityLockService.getIsLocked();
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector, private focusProtection: FocusProtectionService, public screenshotBlocking: ScreenshotBlockingService, private http: HttpClient) {
    ToastService.initialize(appRef, injector);
  }

  protected categoryService = new CategoryService(this.http)
  protected categoryLocalService = new CategoryLocalService(this.categoryService);
  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);

  async ngOnInit(): Promise<void> {
    await this.categoryLocalService.syncCategories();
    await this.passwordManagerService.syncPasswords();

    await StoreService.initialize();
    await AppdataService.ensureDurmanpassDir();

    this.windowLabel = await WindowService.getWindowLabel();

    if(this.windowLabel === WINDOWS_LABELS.VAULT){
    }
    SecurityLockService.initialize();

    SettingsService.loadSettings();


    setInterval(() => {
      this.isLocked = SecurityLockService.getIsLocked();
    }, 1000);
  }

  private ivService = new IvService(this.http)


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

  // async testCrypto(): Promise<void> {
  //   try {
  //     const plaintext = 'Password123';
  //     const key = 'j6V%RTaM'; // Ключ 32 байта для AES-256
  //     const iv = await this.ivService.generateIv(); // Получаем IV
  //     console.log('iv', iv)
  //
  //
  //     // Шифрование
  //     const encrypted = await CryptoAesGcmService.encrypt(plaintext, key, iv);
  //     console.log('Зашифровано:', encrypted);
  //
  //     // Расшифровка
  //     const decrypted = await CryptoAesGcmService.decrypt(encrypted, key, iv);
  //     console.log('Расшифровано:', decrypted);
  //   } catch (e) {
  //     console.error('Ошибка:', e);
  //   }
  // }

  protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}
