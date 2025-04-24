import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {PasswordEntryInterface} from "../../../../interfaces/data/passwordEntry.interface";
import {TreeNode} from "../../../../interfaces/components/view/tree-view.interface";
import {TreeGraphService} from "../../../../services/tree/tree-graph.service";
import * as d3 from 'd3';
import {corePath, leafPath} from "../../../../shared/const/svg/svg-path";

@Component({
  selector: 'app-password-tree',
  standalone: true,
  imports: [],
  templateUrl: './password-tree.component.html',
  styleUrl: './password-tree.component.css'
})
export class PasswordTreeComponent {
  @Input() entries: PasswordEntryInterface[] = [];
  @Output() copyEntry = new EventEmitter<string>();
  @Output() editEntry = new EventEmitter<string>();
  @Output() deleteEntry = new EventEmitter<string>();
  @Output() addEntry = new EventEmitter<void>();

  private svg: any;
  private treeData: TreeNode | null = null;

  constructor(private treeGraphService: TreeGraphService) {}

  ngOnInit(): void {
    this.initTree();
    this.updateTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries']) {
      this.updateTree();
    }
  }

  private initTree(): void {
    const width = 800;
    const height = 600;

    this.svg = d3.select('#tree')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        // @ts-ignore
        .call(d3.zoom().on('zoom', (event) => {
          this.svg.attr('transform', event.transform);
        }))
        .append('g');

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

  private updateTree(): void {
    if (!this.entries.length) return;

    // Получаем данные дерева
    this.treeData = this.treeGraphService.buildTree(this.entries);
    const treeLayout = d3.tree().size([600, 400]);
    const root = d3.hierarchy(this.treeData, d => d.children);
    // @ts-ignore
    treeLayout(root);

    // Обновляем узлы
    const node = this.svg.selectAll('.node')
        .data(root.descendants(), (d: any) => d.data.id)
        .join('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Рендеринг узлов
    node.selectAll('path')
        .data((d: any) => [d])
        .join('path')
        .attr('d', (d: any) => d.data.type === 'password' ? leafPath : null)
        .attr('fill', (d: any) => d.data.color || '#000')
        .attr('filter', (d: any) => d.data.color ? 'url(#glow)' : null)
        .attr('transform', (d: any) => {
          const scale = d.type === 'password' ? 0.2 : 0.2; // Масштаб для лепестков и ядер
          const offsetX = d.type === 'password' ? -10 : -2; // Центрирование по X
          const offsetY = d.type === 'password' ? 1000 : -5; // Центрирование по Y
          return `scale(${scale}) translate(${offsetX / scale}, ${offsetY / scale})`;
        });

    // Рендеринг кругов для категорий и email
    node.selectAll('circle')
        .data((d: any) => [d])
        .join('circle')
        .attr('r', (d: any) => d.data.type === 'password' ? 0 : (d.data.size || 10))
        .attr('fill', (d: any) => d.data.type !== 'password' ? (d.data.color || '#000') : 'none')
        .attr('filter', (d: any) => d.data.type !== 'password' && d.data.color ? 'url(#glow)' : null);

    // Рендеринг текста
    node.selectAll('text')
        .data((d: any) => [d])
        .join('text')
        .attr('dy', '.35em')
        .attr('dx', (d: any) => d.data.type === 'password' ? 12 : 15)
        .text((d: any) => d.data.label)
        .attr('fill', '#fff');

    // Обработчик сворачивания/разворачивания
    node.on('click', (event: any, d: any) => {
      if (d.data.type !== 'password') {
        d.data.collapsed = !d.data.collapsed;
        this.updateTree();
      } else {
        const passwordId = d.data.id.replace('password-', '');
        if (event.ctrlKey) {
          this.copyEntry.emit(passwordId);
        } else if (event.altKey) {
          this.deleteEntry.emit(passwordId);
        } else {
          this.editEntry.emit(passwordId);
        }
      }
    });

    // Обновляем связи
    const link = this.svg.selectAll('.link')
        .data(root.links(), (d: any) => `${d.source.data.id}-${d.target.data.id}`)
        .join('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x((d: any) => d.y)
            .y((d: any) => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6);

    // Скрываем дочерние элементы для свёрнутых узлов
    node.style('display', (d: any) => {
      let parent = d.parent;
      while (parent) {
        if (parent.data.collapsed) return 'none';
        parent = parent.parent;
      }
      return 'block';
    });

    link.style('display', (d: any) => {
      let parent = d.source;
      while (parent) {
        if (parent.data.collapsed) return 'none';
        parent = parent.parent;
      }
      return 'block';
    });
  }
}
