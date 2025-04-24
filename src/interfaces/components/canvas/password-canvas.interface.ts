export interface CanvasNode {
    id: string;
    type: 'password' | 'category' | 'email';
    label: string;
    strength?: number;
    color?: string;
    size?: number;
}

export interface CanvasLink {
    source: string;
    target: string;
    type: 'category' | 'email';
}