import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {TimelineNode} from "../../../../interfaces/components/view/timeline-view.interface";
import {TimelineGraphService} from "../../../../services/timeline/timeline-graph.service";
import * as d3 from 'd3';
import {ruLocale} from "../../../../shared/const/locale/ru-locale.const";

@Component({
  selector: 'app-password-timeline',
  standalone: true,
  imports: [],
  templateUrl: './password-timeline.component.html',
  styleUrl: './password-timeline.component.css'
})
export class PasswordTimelineComponent {
  @Input() entries: PasswordEntryInterface[] = [];
  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() addEntry = new EventEmitter<void>();

  private svg: any;
  private nodes: TimelineNode[] = [];
  private range: 'month' | 'year' | 'all' = 'all';

  constructor(private timelineGraphService: TimelineGraphService) {}

  ngOnInit(): void {
    this.initTimeline();
    this.updateTimeline();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries']) {
      this.updateTimeline();
    }
  }

  setRange(range: 'month' | 'year' | 'all'): void {
    this.range = range;
    this.updateTimeline();
  }

  private initTimeline(): void {
    const width = 1200; // Увеличиваем ширину для горизонтальных полосок
    const height = 900;

    this.svg = d3.select('#timeline')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '80vw')
        // @ts-ignore
        .call(d3.zoom().on('zoom', (event) => {
          this.svg.attr('transform', event.transform);
        }))
        .append('g')
        .attr('transform', 'translate(100, 50)'); // Увеличиваем отступ слева для оси

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

  private updateTimeline(): void {
    if (!this.entries.length) return;

    // Получаем данные шкалы
    this.nodes = this.timelineGraphService.buildTimeline(this.entries, this.range);
    if (!this.nodes.length) return;

    const width = 1000;
    const height = 500;
    const barWidth = 200;
    const barHeight = 40;
    const barSpacing = 10;

    // Определяем масштаб времени по Y
    const dates = this.nodes.map(d => d.date);
    const yScale = d3.scaleTime()
        .domain([d3.max(dates)!, d3.min(dates)!]) // Инвертируем, чтобы новые даты были сверху
        .range([0, height])
        .nice();

    // Ось Y с русской локализацией
    this.svg.selectAll('.axis').remove();
    this.svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale)
            .ticks(5)
            // @ts-ignore
            .tickFormat(ruLocale.format('%d %b %H:%M'))); // Формат: "23 Сен 15:00"

    // Группируем узлы по датам
    const nodesByDate = d3.group(this.nodes, d => d.date.toDateString());

    // Создаём данные для рендеринга с индексами внутри групп
    const positionedNodes = this.nodes.map(node => {
      const group = nodesByDate.get(node.date.toDateString())!;
      const index = group.indexOf(node);
      return { ...node, groupIndex: index };
    });

    // Обновляем узлы
    const node = this.svg.selectAll('.node')
        .data(positionedNodes, (d: any) => d.id)
        .join('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.groupIndex * (barWidth + barSpacing)}, ${yScale(d.date)})`);

    // Рендеринг полосок
    node.selectAll('rect')
        .data((d: any) => [d])
        .join('rect')
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('rx', 4)
        .attr('fill', (d: TimelineNode) => d.color)
        .attr('filter', 'url(#glow)')
        .attr('stroke', (d: TimelineNode) => d.isOutdated ? '#7f8c8d' : 'none')
        .attr('stroke-width', 2);

    // Рендеринг текста внутри полосок
    node.selectAll('text')
        .data((d: any) => [d])
        .join('text')
        .attr('x', 10)
        .attr('y', 15)
        .attr('fill', '#fff')
        .style('font-size', '12px')
        .text((d: TimelineNode) => d.label)
        .append('tspan')
        .attr('x', 10)
        .attr('dy', '1.2em')
        .text((d: TimelineNode) => `${d.category}, ${d.email}`);

    // Интерактивность
    node.on('click', (event: any, d: TimelineNode) => {
      const passwordId = d.id.replace('password-', '');
      if (event.ctrlKey) {
        this.copyEntry.emit(passwordId);
      } else if (event.altKey) {
        this.deleteEntry.emit(passwordId);
      } else {
        this.editEntry.emit(passwordId);
      }
    });
  }
}
