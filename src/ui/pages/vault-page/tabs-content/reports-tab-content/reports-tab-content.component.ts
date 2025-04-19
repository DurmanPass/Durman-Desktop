import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ReportService} from "../../../../../services/report.service";
import {ReportCard} from "../../../../../interfaces/data/reportCard.interface";
import {ReportCardComponent} from "../../../../components/cards/report-card/report-card.component";
import {HeaderDescriptionComponent} from "../../../../components/text/header-description/header-description.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {deleteMarginWindow, deleteOverflowWindow} from "../../../../../utils/overflow.utils";
import {writeFile} from "@tauri-apps/plugin-fs";
import {ToastService} from "../../../../../services/notification/toast.service";
import {join, normalize} from "@tauri-apps/api/path";
import {DialogService} from "../../../../../services/filesystem/dialog.service";

@Component({
  selector: 'app-reports-tab-content',
  standalone: true,
  imports: [
    NgForOf,
    ReportCardComponent,
    HeaderDescriptionComponent,
    NgIf
  ],
  templateUrl: './reports-tab-content.component.html',
  styleUrl: './reports-tab-content.component.css'
})
export class ReportsTabContentComponent {
  reportCards: ReportCard[] = ReportService.getAllReports();
  selectedReport: ReportCard | null = null;
  reportHtml: SafeHtml | null = null;
  rawHtml: string | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.reportCards = ReportService.getAllReports();
  }

  async generateReport(report: ReportCard): Promise<void> {
    try {
      this.selectedReport = report;
      const htmlContent = await report.action();
      this.rawHtml = htmlContent;
      this.reportHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
      deleteOverflowWindow();
      deleteMarginWindow();
    } catch (err) {
      console.error('Error generating report:', err);
      this.reportHtml = this.sanitizer.bypassSecurityTrustHtml('<p>Ошибка при генерации отчёта.</p>');
    }
  }

  clearReport(): void {
    this.selectedReport = null;
    this.reportHtml = null;
    this.rawHtml = null;
  }

  async downloadReport(): Promise<void> {
    if (!this.rawHtml || !this.selectedReport) {
      ToastService.warning('Нет отчёта для скачивания');
      return;
    }

    const reportIdToFileName: { [key: string]: string } = {
      'weak-passwords': 'weak-passwords-report',
      'frequent-usage': 'frequent-usage-report',
      'non-security-sites': 'unsafe-url-report'
    };

    const fileName = reportIdToFileName[this.selectedReport.id] || 'report';
    const selectedPath = await DialogService.selectPath();

    if (!selectedPath || typeof selectedPath !== 'string') {
      console.log('No path selected for saving report');
      ToastService.warning('Выберите папку для сохранения отчёта');
      return;
    }

    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(this.rawHtml);
    const fullPath = await join(selectedPath, `${fileName}-${new Date().toISOString().slice(0, 10)}.html`);
    const normalizedPath = await normalize(fullPath);

    try {
      console.log('Saving report to:', normalizedPath);
      await writeFile(normalizedPath, uint8Array);
      console.log('Report saved successfully');
      ToastService.success('Отчёт успешно сохранён!');
    } catch (err) {
      console.error('Error saving report:', err);
      ToastService.danger('Не удалось сохранить отчёт');
    }
  }
}
