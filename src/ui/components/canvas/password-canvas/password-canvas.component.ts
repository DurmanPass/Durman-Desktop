import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {CanvasLink, CanvasNode} from "../../../../interfaces/components/canvas/password-canvas.interface";
import {CanvasGraphService} from "../../../../services/canvas/canvas-graph.service";
import * as d3 from 'd3';
import {corePath, leafPath} from "../../../../shared/const/svg/svg-path";

@Component({
  selector: 'app-password-canvas',
  standalone: true,
  imports: [],
  templateUrl: './password-canvas.component.html',
  styleUrl: './password-canvas.component.css'
})
export class PasswordCanvasComponent {
  @Input() entries: PasswordEntryInterface[] = [];
  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() addEntry = new EventEmitter<void>();

  private svg: any;
  private simulation: any;
  private nodes: CanvasNode[] = [];
  private links: CanvasLink[] = [];

  constructor(private canvasGraphService: CanvasGraphService) {}

  ngOnInit(): void {
    this.initCanvas();
    this.updateGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries']) {
      this.updateGraph();
    }
  }

  private initCanvas(): void {
    const width = 800;
    const height = 600;

    this.svg = d3.select('#canvas')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        // @ts-ignore
        .call(d3.zoom().on('zoom', (event) => {
          this.svg.attr('transform', event.transform);
        }))
        .append('g');

    this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(width / 2, height / 2));
  }

  private updateGraph(): void {
    const graph = this.canvasGraphService.buildGraph(this.entries);
    this.nodes = graph.nodes;
    this.links = graph.links;

    // Обновляем связи
    const link = this.svg.selectAll('.link')
        .data(this.links, (d: any) => `${d.source.id}-${d.target.id}`)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);

    // Обновляем узлы
    const node = this.svg.selectAll('.node')
        .data(this.nodes, (d: any) => d.id)
        .join('g')
        .attr('class', 'node')
        .call(this.drag(this.simulation) as any);

    // Рендеринг узлов
    node.selectAll('path')
        .data((d: any) => [d])
        .join('path')
        .attr('d', (d: CanvasNode) => d.type === 'password' ? leafPath : corePath)
        .attr('fill', (d: CanvasNode) => d.color || '#000')
        .attr('transform', (d: CanvasNode) => {
          const scale = d.type === 'password' ? 0.2 : 0.05; // Масштаб для лепестков и ядер
          const offsetX = d.type === 'password' ? -2 : -12; // Центрирование по X
          const offsetY = d.type === 'password' ? -8 : -13; // Центрирование по Y
          return `scale(${scale}) translate(${offsetX / scale}, ${offsetY / scale})`;
        });

    node.selectAll('text')
        .data((d: any) => [d])
        .join('text')
        .attr('dy', '.35em')
        .attr('dx', 12)
        .text((d: CanvasNode) => d.label)
        .attr('fill', '#fff');

    // Добавляем обработчики кликов
    node.on('click', (event: any, d: CanvasNode) => {
      if (d.type === 'password') {
        const passwordId = d.id.replace('password-', '');
        if (event.ctrlKey) {
          this.copyEntry.emit(passwordId);
        } else if (event.altKey) {
          this.deleteEntry.emit(passwordId);
        } else {
          this.editEntry.emit(passwordId);
        }
      }
    });

    // Обновляем симуляцию
    this.simulation.nodes(this.nodes).on('tick', () => {
      link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

      node
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  private drag(simulation: any): any {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
  }
}
