import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {Step} from "../../../../interfaces/components/steps/login-steps.interface";
import {TextLinkComponent} from "../../links/text-link/text-link.component";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";
import {StepValidation} from "../../../../interfaces/components/steps/stepValidation.interface";
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";

@Component({
  selector: 'app-step',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgComponentOutlet,
    TextLinkComponent,
    SolidButtonComponent
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
  @Input() activeBorderColorStep?: keyof typeof ThemeColors; // Цвет границы активного шага
  @Input() lineColorStepActive?: keyof typeof ThemeColors; // Зеленая линия между шагами
  @Input() completedBorderColorStep?: keyof typeof ThemeColors = 'DarkGreen';
  @Input() onFinish!: () => void; // Функция, вызываемая на последнем шаге

  @Input() validateSteps!: StepValidation;

  currentStep: number = 0;

  isStepValid(stepKey: string): boolean {
    const stepValidation = this.validateSteps[stepKey];

    if (!stepValidation) return false; // Если шага нет — считаем невалидным

    // Если есть явный флаг `isValid`, то возвращаем его
    if ('isValid' in stepValidation && typeof stepValidation['isValid'] === 'boolean') {
      return stepValidation['isValid'];
    }

    // Если `isValid` нет, проверяем ВСЕ вложенные поля
    return Object.values(stepValidation).every(value =>
        typeof value === 'boolean' ? value : this.isStepValid(value as unknown as string)
    );
  }


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
    this.stepChanged.emit(this.steps[this.currentStep].contentId); // Отправляем id текущего шага
  }

  // Завершение процесса (вызывает переданную функцию onFinish)
  finish() {
    if (this.onFinish) {
      this.onFinish();
    }
  }

  protected readonly ThemeColors = ThemeColors;
}
