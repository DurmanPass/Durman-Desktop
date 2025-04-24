import { Injectable } from '@angular/core';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {CanvasLink, CanvasNode} from "../../interfaces/components/canvas/password-canvas.interface";

@Injectable({
  providedIn: 'root'
})
export class CanvasGraphService {
  buildGraph(entries: PasswordEntryInterface[]): { nodes: CanvasNode[]; links: CanvasLink[] } {
    const nodes: CanvasNode[] = [];
    const links: CanvasLink[] = [];
    const categoryMap = new Map<string, string>(); // categoryLabel -> nodeId
    const emailMap = new Map<string, string>(); // email -> nodeId

    // Создаём узлы для категорий
    const uniqueCategories = new Set(entries.map(entry => entry.metadata.categoryLabel || 'Все'));
    uniqueCategories.forEach(category => {
      const nodeId = `category-${category}`;
      nodes.push({
        id: nodeId,
        type: 'category',
        label: category,
        color: '#4a90e2', // Синий для категорий
        size: 20
      });
      categoryMap.set(category, nodeId);
    });

    // Создаём узлы для email
    const uniqueEmails = new Set(entries.map(entry => entry.credentials.email).filter(email => email));
    uniqueEmails.forEach(email => {
      const nodeId = `email-${email}`;
      nodes.push({
        id: nodeId,
        type: 'email',
        label: email!,
        color: '#f39c12', // Оранжевый для email
        size: 15
      });
      emailMap.set(email!, nodeId);
    });

    // Создаём узлы для паролей и связи
    entries.forEach(entry => {
      const nodeId = `password-${entry.id}`;
      const strength = entry.credentials.passwordStrength ?? 3;
      nodes.push({
        id: nodeId,
        type: 'password',
        label: entry.name || 'Без имени',
        strength,
        color: strength >= 3 ? '#2ecc71' : strength >= 1 ? '#f1c40f' : '#e74c3c', // Зелёный, жёлтый, красный
        size: 10
      });

      // Связь с категорией
      const category = entry.metadata.categoryLabel || 'Все';
      const categoryNodeId = categoryMap.get(category);
      if (categoryNodeId) {
        links.push({
          source: categoryNodeId,
          target: nodeId,
          type: 'category'
        });
      }

      // Связь с email
      if (entry.credentials.email) {
        const emailNodeId = emailMap.get(entry.credentials.email);
        if (emailNodeId) {
          links.push({
            source: emailNodeId,
            target: nodeId,
            type: 'email'
          });
        }
      }
    });

    return { nodes, links };
  }

  // Метод для добавления нового узла (например, при создании пароля)
  addNode(
    graph: { nodes: CanvasNode[]; links: CanvasLink[] },
    entry: PasswordEntryInterface,
    categoryLabel: string,
    email?: string
  ): void {
    const nodeId = `password-${entry.id}`;
    const strength = entry.credentials.passwordStrength ?? 3;
    graph.nodes.push({
      id: nodeId,
      type: 'password',
      label: entry.name || 'Без имени',
      strength,
      color: strength >= 3 ? '#2ecc71' : strength >= 1 ? '#f1c40f' : '#e74c3c',
      size: 10
    });

    // Связь с категорией
    const categoryNodeId = `category-${categoryLabel}`;
    if (graph.nodes.some(node => node.id === categoryNodeId)) {
      graph.links.push({
        source: categoryNodeId,
        target: nodeId,
        type: 'category'
      });
    }

    // Связь с email
    if (email) {
      const emailNodeId = ` email-${email}`;
      if (graph.nodes.some(node => node.id === emailNodeId)) {
        graph.links.push({
          source: emailNodeId,
          target: nodeId,
          type: 'email'
        });
      }
    }
  }

  // Метод для удаления узла
  removeNode(graph: { nodes: CanvasNode[]; links: CanvasLink[] }, passwordId: string): void {
    const nodeId = `password-${passwordId}`;
    graph.nodes = graph.nodes.filter(node => node.id !== nodeId);
    graph.links = graph.links.filter(link => link.source !== nodeId && link.target !== nodeId);
  }
}