import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {ReportService} from "../../../../../services/report.service";
import {ReportCard} from "../../../../../interfaces/data/reportCard.interface";
import {ReportCardComponent} from "../../../../components/cards/report-card/report-card.component";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";

@Component({
  selector: 'app-reports-tab-content',
  standalone: true,
  imports: [
    NgForOf,
    ReportCardComponent,
    HeaderDescriptionComponent
  ],
  templateUrl: './reports-tab-content.component.html',
  styleUrl: './reports-tab-content.component.css'
})
export class ReportsTabContentComponent {
  reportCards: ReportCard[] = ReportService.getAllReports();

  ngOnInit(): void {
    this.reportCards = ReportService.getAllReports();
  }
}
