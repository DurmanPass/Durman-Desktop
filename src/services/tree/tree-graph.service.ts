import { Injectable } from '@angular/core';
import { PasswordEntryInterface } from '../../interfaces/data/passwordEntry.interface';
import {TreeNode} from "../../interfaces/components/view/tree-view.interface";

@Injectable({
    providedIn: 'root'
})
export class TreeGraphService {
    buildTree(entries: PasswordEntryInterface[]): TreeNode {
        const root: TreeNode = {
            id: 'root',
            type: 'root',
            label: 'All Passwords',
            children: [],
            collapsed: false
        };

        const categoryMap = new Map<string, TreeNode>();
        const emailMap = new Map<string, TreeNode>();

        // Создаём узлы категорий
        const uniqueCategories = new Set(entries.map(entry => entry.metadata.categoryLabel || 'Без категории'));
        uniqueCategories.forEach(category => {
            const nodeId = `category-${category}`;
            const categoryNode: TreeNode = {
                id: nodeId,
                type: 'category',
                label: category,
                color: '#4a90e2', // Синий для категорий
                size: 20,
                children: [],
                collapsed: false
            };
            categoryMap.set(category, categoryNode);
            root.children!.push(categoryNode);
        });

        // Создаём узлы email
        const uniqueEmails = new Set(entries.map(entry => entry.credentials.email).filter(email => email));
        uniqueEmails.forEach(email => {
            const nodeId = `email-${email}`;
            const emailNode: TreeNode = {
                id: nodeId,
                type: 'email',
                label: email!,
                color: '#f39c12', // Оранжевый для email
                size: 15,
                children: [],
                collapsed: false
            };
            emailMap.set(email!, emailNode);
            root.children!.push(emailNode);
        });

        // Создаём узлы паролей
        entries.forEach(entry => {
            const nodeId = `password-${entry.id}`;
            const strength = entry.credentials.passwordStrength ?? 3;
            const passwordNode: TreeNode = {
                id: nodeId,
                type: 'password',
                label: entry.name || 'Без имени',
                strength,
                color: strength >= 3 ? '#2ecc71' : strength >= 1 ? '#f1c40f' : '#e74c3c', // Зелёный, жёлтый, красный
                size: 10,
                children: [],
                collapsed: false
            };

            // Добавляем пароль в категорию
            const category = entry.metadata.categoryLabel || 'Без категории';
            const categoryNode = categoryMap.get(category);
            if (categoryNode) {
                categoryNode.children!.push(passwordNode);
                passwordNode.parent = categoryNode;
            }

            // Добавляем пароль в email
            if (entry.credentials.email) {
                const emailNode = emailMap.get(entry.credentials.email);
                if (emailNode) {
                    emailNode.children!.push(passwordNode);
                    passwordNode.parent = emailNode;
                }
            }
        });

        // Удаляем пустые узлы
        root.children = root.children!.filter(node => node.children!.length > 0);

        return root;
    }
}