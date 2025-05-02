import {Component, EventEmitter, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-welcome-animation',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './welcome-animation.component.html',
  styleUrl: './welcome-animation.component.css'
})
export class WelcomeAnimationComponent {
  @Output() animationComplete = new EventEmitter<void>();
  showText = false;
  showComponent = true;

  ngOnInit(): void {
    // Показать текст через 0.5 секунды после загрузки
    setTimeout(() => {
      this.showText = true;
    }, 500);

    // Завершить анимацию через 2.5 секунды (2с GIF + 0.5с растворение)
    setTimeout(() => {
      this.showComponent = false;
      setTimeout(() => {
        this.animationComplete.emit();
      }, 500); // Время для эффекта растворения
    }, 1300);
  }
}
