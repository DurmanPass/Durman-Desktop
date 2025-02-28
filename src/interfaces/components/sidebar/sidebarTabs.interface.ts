import {Type} from "@angular/core";

export interface SidebarTab {
    id: string;
    title: string;
    content: Type<any>;
}