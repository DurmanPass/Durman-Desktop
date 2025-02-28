import {ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordStrengthService} from "../../../../services/password/password-strength.service";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {
  DefaultPasswordStrengthSize, PasswordStrengthBarSizes,
  PasswordStrengthSizesType
} from "../../../../shared/const/components/sizes/passwordStrengthSizes";

@Component({
  selector: 'app-password-strength-bar',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgForOf
  ],
  templateUrl: './password-strength-bar.component.html',
  styleUrl: './password-strength-bar.component.css'
})
export class PasswordStrengthBarComponent {
  @Input() password: string = '';
  @Input() size: PasswordStrengthSizesType = DefaultPasswordStrengthSize;
  @Input() showHints: boolean = true;
  @Output() strengthChanged = new EventEmitter<number>();

  strength: number = 0;
  feedback: any = '';

  constructor(private passwordStrengthService: PasswordStrengthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.evaluateStrength();
    }
  }

  private evaluateStrength(): void {
    if (!this.password) {
      this.strength = 0;
      this.feedback = null;
    } else {
      const result = this.passwordStrengthService.evaluatePassword(this.password);
      this.strengthChanged.emit(this.strength);
      this.strength = result.score;
      this.feedback = result.feedback;
    }
    this.strengthChanged.emit(this.strength);
  }

  getGradient(score: number): string {
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
    return colors[score];
  }

  protected readonly PasswordStrengthBarSizes = PasswordStrengthBarSizes;
}
