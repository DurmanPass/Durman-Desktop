import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {HeaderDescriptionComponent} from "../../text/header-description/header-description.component";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    HeaderDescriptionComponent
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Output() result = new EventEmitter<boolean>();

  onConfirm(): void {
    this.result.emit(true);
    this.closeModal();
  }

  onNotConfirm(): void {
    this.result.emit(false);
    this.closeModal();
  }

  // Метод для закрытия модального окна (вызываем из ModalBaseComponent)
  closeModal(): void {
    const modalBase = this as any as ModalBaseComponent;
    modalBase.closeModal();
  }
}
