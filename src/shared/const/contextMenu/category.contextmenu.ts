import {ContextMenuItem} from "../../../interfaces/components/context-menu-item.interface";
import {Category} from "../../../interfaces/data/category.interface";

export const CategoryContextMenu = (category: Category,
                                    updateCategory: (category: Category) => void,
                                    deleteCategory: (categoryId: string) => void): ContextMenuItem[] => [
    {
        id: 'change-category',
        text: 'Изменить категорию',
        action: () => updateCategory(category),
        icon: 'assets/icons/contextMenu/category/change.svg',
    },
    {
        id: 'delete-category',
        text: 'Удалить категорию',
        action: () => deleteCategory(category.id),
        icon: 'assets/icons/contextMenu/category/delete.svg',
    }
]