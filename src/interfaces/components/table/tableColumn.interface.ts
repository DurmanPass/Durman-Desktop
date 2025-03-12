export interface TableColumn<T> {
    label: string;              // Заголовок колонки
    render: (item: T) => string; // Функция для извлечения значения из объекта
}