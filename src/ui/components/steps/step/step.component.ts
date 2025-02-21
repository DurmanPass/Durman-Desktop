import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {Step} from "../../../../interfaces/components/steps/login-steps.interface";
import {TextLinkComponent} from "../../links/text-link/text-link.component";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgComponentOutlet,
    TextLinkComponent
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.css'
})
export class StepComponent {
  @Input() bgColorStep?: keyof typeof ThemeColors;
  @Input() borderColorStep?: keyof typeof ThemeColors;
  @Input() lineColorStep?: keyof typeof ThemeColors;
  @Input() steps: Step[] = []; // Массив шагов передается в компонент
  @Output() stepChanged: EventEmitter<string> = new EventEmitter(); // Событие для возврата текущего шага
  @Input() onFinish!: () => void; // Функция, вызываемая на последнем шаге


  currentStep: number = 0;

  // Переход к следующему шагу
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.emitStepChange(); // Вызываем событие при изменении шага
    }
  }

  // Переход к предыдущему шагу
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.emitStepChange(); // Вызываем событие при изменении шага
    }
  }

  // Пропуск текущего шага
  skipStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.emitStepChange(); // Вызываем событие при изменении шага
    }
  }

  // Метод для передачи текущего шага в родительский компонент
  emitStepChange() {
    this.stepChanged.emit(this.steps[this.currentStep].id); // Отправляем id текущего шага
  }

  // Завершение процесса (вызывает переданную функцию onFinish)
  finish() {
    if (this.onFinish) {
      this.onFinish();
    }
  }

  protected readonly ThemeColors = ThemeColors;
}
