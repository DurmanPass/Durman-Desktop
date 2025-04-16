import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../../../services/notification/toast.service";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    HeaderDescriptionComponent,
    NgIf,
    FormsModule
  ],
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

  onConfirm(): void {
    if (this.requirePassword && !this.validatePassword()) {
      this.passwordError = 'Введите пароль';
      return;
    }
    if (this.requireEmailCode && !this.validateEmailCode()) {
      this.emailCodeError = 'Введите код';
      return;
    }
    this.result.emit(true);
    this.closeModal();

    if(this.toastSuccessDescription.length > 0){
      ToastService.success(this.toastSuccessDescription);
    }
  }

  onNotConfirm(): void {
    this.result.emit(false);
    this.closeModal();
  }

  private validatePassword(): boolean {
    // Здесь можно добавить реальную проверку пароля, например, через сервис
    return this.password.trim().length > 0;
  }

  private validateEmailCode(): boolean {
    // Здесь можно добавить реальную проверку кода, например, через API
    return this.emailCode.trim().length > 0;
  }

  closeModal(): void {
    const modalBase = this as any as ModalBaseComponent;
    modalBase.closeModal();
  }
}
