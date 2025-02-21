// Определяем интерфейс для шага
import {Type} from "@angular/core";

export interface Step {
    id: string;           // Идентификатор шага
    skip: boolean;        // Можем ли пропустить шаг
    contentId: string     // Компонент, который будет отображаться на этом шаге,
}