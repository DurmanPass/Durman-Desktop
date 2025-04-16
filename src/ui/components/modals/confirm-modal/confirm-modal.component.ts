import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { HeaderDescriptionComponent } from '../../text/header-description/header-description.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../services/notification/toast.service';
import {StoreService} from "../../../../services/vault/store.service";
import {StoreKeys} from "../../../../shared/const/vault/store.keys";
import {InputComponent} from "../../inputs/input/input.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [HeaderDescriptionComponent, NgIf, FormsModule, InputComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() requirePassword: boolean = false;
  @Input() requireEmailCode: boolean = false;
  @Input() toastSuccessDescription: string = '';
  @Input() toastDangerDescription: string = '';

  @Output() result = new EventEmitter<boolean>();

  password: string = '';
  emailCode: string = '';
  passwordError: string = '';
  emailCodeError: string = '';

  step: 'confirm' | 'password' | 'emailCode' = 'confirm';

  async onConfirm() {
    if (this.step === 'confirm') {
      if (this.requirePassword) {
        this.step = 'password';
      } else if (this.requireEmailCode) {
        this.step = 'emailCode';
      } else {
        this.complete(true);
      }
    } else if (this.step === 'password') {
      if (!await this.validatePassword()) {
        this.passwordError = 'Неверный пароль!';
        return;
      }
      if (this.requireEmailCode) {
        this.step = 'emailCode';
      } else {
        this.complete(true);
      }
    } else if (this.step === 'emailCode') {
      if (!this.validateEmailCode()) {
        this.emailCodeError = 'Введите код';
        return;
      }
      this.complete(true);
    }
  }

  onNotConfirm(): void {
    this.complete(false);
  }

  private async validatePassword(): Promise<boolean> {
    const password = await StoreService.get(StoreKeys.MASTER_PASSWORD);
    return this.password.trim().length > 0 && password === this.password;
  }

  private validateEmailCode(): boolean {
    return this.emailCode.trim().length > 0;
  }

  private complete(success: boolean): void {
    this.result.emit(success);
    this.closeModal();
    if (success && this.toastSuccessDescription.length > 0) {
      ToastService.success(this.toastSuccessDescription);
    } else if (!success && this.toastDangerDescription.length > 0) {
      ToastService.danger(this.toastDangerDescription);
    }
  }

  closeModal(): void {
    const modalBase = this as any as ModalBaseComponent;
    modalBase.closeModal();
  }

  onPasswordChange(value: string){
    this.password = value;
  }
}
