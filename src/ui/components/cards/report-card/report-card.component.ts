import {Component, Input} from '@angular/core';
import {SolidButtonComponent} from "../../buttons/solid-button/solid-button.component";
import {NgForOf, NgIf} from "@angular/common";
import {ReportCard} from "../../../../interfaces/data/reportCard.interface";
import {ThemeColors} from "../../../../shared/const/colors/general/themeColors";

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [
    SolidButtonComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent {
  @Input() reportCard: ReportCard | null = null;
  @Input() headerBgColor: keyof typeof ThemeColors | string = ThemeColors.Transparent;
  @Input() mainBgColor: keyof typeof ThemeColors | string = ThemeColors.Transparent;
  @Input() borderColor: keyof typeof ThemeColors | string = ThemeColors.Transparent;
}
