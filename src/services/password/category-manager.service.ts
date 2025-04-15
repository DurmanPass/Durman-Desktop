import { PasswordEntryInterface } from "../../interfaces/data/passwordEntry.interface";
import { PasswordManagerService } from "./password-manager.service";

export class CategoryManagerService {
    // Получение всех уникальных категорий
    public static getAllCategories(): (string | null)[] {
        const entries = PasswordManagerService.getAllEntries();
        const categories = entries
            .map(entry => entry.metadata.category)
            .filter(category => category && category.trim() !== ''); // Убираем пустые категории
        return [...new Set(categories)]; // Уникальные категории
    }

    // Получение количества записей в категории
    public static getEntryCountByCategory(category: string): number {
        return PasswordManagerService.getEntriesByCategory(category).length;
    }

    // Добавление новой категории (без привязки к записи)
    public static addCategory(category: string) {
    }

    // Удаление категории (удаляет все записи с этой категорией)
    public static removeCategory(category: string): boolean {
        const entries = PasswordManagerService.getEntriesByCategory(category);
        if (entries.length === 0) return false;

        entries.forEach(entry => {
            PasswordManagerService.removeEntry(entry.id!);
        });
        return true;
    }

    // Переименование категории
    public static renameCategory(oldName: string, newName: string): boolean {
        if (!oldName || !newName || oldName === newName || this.getAllCategories().includes(newName)) {
            return false; // Новая категория уже существует или некорректные данные
        }
        const entries = PasswordManagerService.getEntriesByCategory(oldName);
        if (entries.length === 0) return false;

        entries.forEach(entry => {
            PasswordManagerService.setMetadata(entry.id!, { category: newName });
        });
        return true;
    }

    // Получение записей без категории
    public static getEntriesWithoutCategory(): PasswordEntryInterface[] {
        return PasswordManagerService.getAllEntries().filter(
            entry => !entry.metadata.category || entry.metadata.category.trim() === ''
        );
    }

    // Получение наиболее популярной категории (по количеству записей)
    public static getMostPopularCategory(): string | null {
        const categories = this.getAllCategories();
        if (categories.length === 0) return null;

        return categories.reduce((prev, current) => {
            const prevCount = this.getEntryCountByCategory(prev ? prev : '');
            const currentCount = this.getEntryCountByCategory(current ? current : "");
            return currentCount > prevCount ? current : prev;
        });
    }
}