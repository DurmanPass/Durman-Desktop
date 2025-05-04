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
import {SessionTimeoutService} from "../services/session/session-timeout.service";
import {NetworkLostComponent} from "../ui/components/network/network-lost/network-lost.component";
import {NetworkService} from "../services/network.service";
import {WelcomeAnimationComponent} from "../ui/components/animation/welcome-animation/welcome-animation.component";
import {PreloaderComponent} from "../ui/components/loaders/preloader/preloader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StartPageComponent, PasswordGeneratePageComponent, VaultPageComponent, FrozenAccountPageComponent, ModalBaseComponent, PasswordDetailsModalComponent, ConfirmModalComponent, HttpClientModule, NetworkLostComponent, WelcomeAnimationComponent, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';
  isLocked: boolean = SecurityLockService.getIsLocked();
  isOnline$ = NetworkService.getConnectionStatus();
  showWelcomeAnimation: boolean = false;
  isLoading: boolean = true;
  constructor(appRef: ApplicationRef, injector: EnvironmentInjector, private focusProtection: FocusProtectionService, public screenshotBlocking: ScreenshotBlockingService, private http: HttpClient, private sessionTimeoutService: SessionTimeoutService) {
    ToastService.initialize(appRef, injector);
  }

  protected categoryService = new CategoryService(this.http)
  protected categoryLocalService = new CategoryLocalService(this.categoryService);
  protected serverPasswordService = new PasswordService(this.http);
  protected passwordManagerService = new PasswordManagerService(this.serverPasswordService);

  // async ngOnInit(): Promise<void> {
  //   NetworkService.initialize();
  //   await this.categoryLocalService.syncCategories();
  //   await this.passwordManagerService.syncPasswords();
  //
  //   await StoreService.initialize();
  //   await AppdataService.ensureDurmanpassDir();
  //
  //   this.windowLabel = await WindowService.getWindowLabel();
  //
  //   if (this.windowLabel === WINDOWS_LABELS.MAIN) {
  //     this.showWelcomeAnimation = true;
  //   }
  //
  //   if(this.windowLabel === WINDOWS_LABELS.VAULT){
  //     if (!this.sessionTimeoutService.isSessionTimerStarted()) {
  //       this.sessionTimeoutService.startSessionTimer();
  //     }
  //   }
  //   SecurityLockService.initialize();
  //
  //   SettingsService.loadSettings();
  //
  //
  //   setInterval(() => {
  //     this.isLocked = SecurityLockService.getIsLocked();
  //   }, 1000);
  // }

  async ngOnInit(): Promise<void> {
    await this.categoryLocalService.syncCategories();
    await this.passwordManagerService.syncPasswords();

    this.windowLabel = await WindowService.getWindowLabel();

    if (this.windowLabel === WINDOWS_LABELS.MAIN) {
      this.showWelcomeAnimation = true;
    }

    if(this.windowLabel === WINDOWS_LABELS.VAULT){

      if (!this.sessionTimeoutService.isSessionTimerStarted()) {
        this.sessionTimeoutService.startSessionTimer();
      }
    }

    await StoreService.initialize();
    await AppdataService.ensureDurmanpassDir();
    NetworkService.initialize();

    SecurityLockService.initialize();

    SettingsService.loadSettings();




    setInterval(() => {
      if(this.isLoading){this.isLoading = false;}
      this.isLocked = SecurityLockService.getIsLocked();
    }, 1000);
  }

  onAnimationComplete(): void {
    this.showWelcomeAnimation = false;
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
  protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}
