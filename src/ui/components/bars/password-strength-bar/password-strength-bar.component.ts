import {ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordStrengthService} from "../../../../services/password/password-strength.service";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {
  DefaultPasswordStrengthSize, PasswordStrengthBarSizes,
  PasswordStrengthSizesType
} from "../../../../shared/const/components/sizes/passwordStrengthSizes";
import {PasswordStrengthTranslation} from "../../../../shared/const/translation/password-strength.translation";

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
  feedback: any = null;
  translatedFeedback: { warning: string; suggestions: string[] } | null = null;

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
      this.translatedFeedback = null;
    } else {
      const result = this.passwordStrengthService.evaluatePassword(this.password);
      this.strength = result.score;
      this.feedback = result.feedback;
      this.translateFeedback();
      this.strengthChanged.emit(this.strength);
    }
  }

  private getWarningKey(text: string): keyof typeof PasswordStrengthTranslation.warnings | null {
    for (const [key, value] of Object.entries(PasswordStrengthTranslation.warnings)) {
      if (value.en === text) {
        return key as keyof typeof PasswordStrengthTranslation.warnings;
      }
    }
    return null;
  }

  private getSuggestionKey(text: string): keyof typeof PasswordStrengthTranslation.suggestions | null {
    for (const [key, value] of Object.entries(PasswordStrengthTranslation.suggestions)) {
      if (value.en === text) {
        return key as keyof typeof PasswordStrengthTranslation.suggestions;
      }
    }
    return null;
  }

  private translateFeedback(): void {
    if (!this.feedback) {
      this.translatedFeedback = null;
      return;
    }

    const warningText = this.feedback.warning || '';
    const warningKey = this.getWarningKey(warningText);
    const translatedWarning = warningKey && PasswordStrengthTranslation.warnings[warningKey]
        ? PasswordStrengthTranslation.warnings[warningKey].ru
        : warningText;

    const translatedSuggestions = (this.feedback.suggestions || []).map((suggestion: string) => {
      const suggestionKey = this.getSuggestionKey(suggestion);
      return suggestionKey && PasswordStrengthTranslation.suggestions[suggestionKey]
          ? PasswordStrengthTranslation.suggestions[suggestionKey].ru
          : suggestion;
    });

    console.log('Raw feedback:', this.feedback);
    console.log('Translated warning:', translatedWarning);
    console.log('Translated suggestions:', translatedSuggestions);

    this.translatedFeedback = {
      warning: translatedWarning,
      suggestions: translatedSuggestions
    };
  }

  getGradient(score: number): string {
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
    return colors[score];
  }

  protected readonly PasswordStrengthBarSizes = PasswordStrengthBarSizes;
}
