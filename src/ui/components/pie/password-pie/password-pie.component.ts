import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {PieChartService} from "../../../../services/pie/pie-graph.service";
import * as d3 from 'd3';
import {PieChartData} from "../../../../interfaces/components/view/pie-view.interface";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-password-pie',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './password-pie.component.html',
  styleUrl: './password-pie.component.css'
})
export class PasswordPieComponent {
  @Input() entries: PasswordEntryInterface[] = [];
  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() addEntry = new EventEmitter<void>();

  private svg: any;
  private groupBy: 'category' | 'email' | 'strength' = 'category';
  selectedEntries: PasswordEntryInterface[] = [];

  constructor(private pieChartService: PieChartService) {}

  ngOnInit(): void {
    this.initPieChart();
    this.updatePieChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries']) {
      this.updatePieChart();
    }
  }

  setGroupBy(groupBy: 'category' | 'email' | 'strength'): void {
    this.groupBy = groupBy;
    this.selectedEntries = []; // Сбрасываем выбор при смене группировки
    this.updatePieChart();
  }

  private initPieChart(): void {
    const width = 500;
    const height = 500;

    this.svg = d3.select('#pie-chart')
        .append('svg')
        .attr('width', '90vw')
        .attr('height', '80vh')
        .append('g')
        .attr('transform', `translate(${width*1.7}, ${height/2.5})`);

    // Добавляем фильтр свечения
    const defs = this.svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    filter.append('feGaussianBlur')
        .attr('stdDeviation', 4)
        .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
  }

  // private updatePieChart(): void {
  //   if (!this.entries.length) return;
  //
  //   // Получаем данные для диаграммы
  //   const data = this.pieChartService.buildPieChartData(this.entries, this.groupBy);
  //   if (!data.length) return;
  //
  //   const radius = 200;
  //   const arc = d3.arc()
  //       .innerRadius(0)
  //       .outerRadius(radius);
  //
  //   const pie = d3.pie<PieChartData>()
  //       .sort(null)
  //       .value(d => d.value);
  //
  //   // Обновляем сегменты
  //   const arcs = this.svg.selectAll('.arc')
  //       .data(pie(data), (d: any) => d.data.key)
  //       .join('g')
  //       .attr('class', 'arc');
  //
  //   arcs.selectAll('path')
  //       .data((d: any) => [d])
  //       .join('path')
  //       .attr('d', arc)
  //       .attr('fill', (d: any) => d.data.color)
  //       .attr('filter', 'url(#glow)')
  //       .attr('stroke', '#fff')
  //       .attr('stroke-width', 2)
  //       .on('click', (event: any, d: any) => {
  //         this.selectedEntries = d.data.entries;
  //       });
  //
  //   // Рендеринг меток
  //   arcs.selectAll('text')
  //       .data((d: any) => [d])
  //       .join('text')
  //       .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
  //       .attr('dy', '.35em')
  //       .attr('text-anchor', 'middle')
  //       .attr('fill', '#fff')
  //       .style('font-size', '12px')
  //       .text((d: any) => `${d.data.key} (${d.data.value})`);
  //
  //   // Статистика в центре
  //   this.svg.selectAll('.center-text').remove();
  //   this.svg.append('text')
  //       .attr('class', 'center-text')
  //       .attr('text-anchor', 'middle')
  //       .attr('dy', '-0.5em')
  //       .attr('fill', '#fff')
  //       .style('font-size', '16px')
  //       .text('Всего паролей');
  //   this.svg.append('text')
  //       .attr('class', 'center-text')
  //       .attr('text-anchor', 'middle')
  //       .attr('dy', '1em')
  //       .attr('fill', '#fff')
  //       .style('font-size', '24px')
  //       .style('font-weight', 'bold')
  //       .text(this.entries.length);
  // }

  private updatePieChart(): void {
    if (!this.entries.length) return;

    // Получаем данные для диаграммы
    const data = this.pieChartService.buildPieChartData(this.entries, this.groupBy);
    if (!data.length) return;

    const radius = 200;
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const pie = d3.pie<PieChartData>()
        .sort(null)
        .value(d => d.value);

    // Обновляем сегменты
    const arcs = this.svg.selectAll('.arc')
        .data(pie(data), (d: any) => d.data.key)
        .join('g')
        .attr('class', 'arc');

    arcs.selectAll('path')
        .data((d: any) => [d])
        .join('path')
        .attr('d', arc)
        .attr('fill', (d: any) => d.data.color)
        .attr('filter', 'url(#glow)')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .on('click', (event: any, d: any) => {
          this.selectedEntries = d.data.entries; // Обновляем список паролей
          console.log(this.selectedEntries);
        });

    // Рендеринг меток
    arcs.selectAll('text')
        .data((d: any) => [d])
        .join('text')
        .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .style('font-size', '12px')
        .text((d: any) => `${d.data.key} (${d.data.value})`);

    // Статистика в центре
    this.svg.selectAll('.center-text').remove();
    this.svg.append('text')
        .attr('class', 'center-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .attr('fill', '#fff')
        .style('font-size', '16px')
        .text('Всего паролей');
    this.svg.append('text')
        .attr('class', 'center-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('fill', '#fff')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .text(this.entries.length);
  }

  onEditEntry(id: string): void {
    this.editEntry.emit(id);
  }

  onCopyEntry(id: string): void {
    this.copyEntry.emit(id);
  }

  onDeleteEntry(id: string): void {
    this.deleteEntry.emit(id);
  }
}
