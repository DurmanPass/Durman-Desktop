export interface TimelineNode {
    id: string;
    type: 'password';
    label: string;
    category: string;
    email: string;
    date: Date;
    strength: number;
    color: string;
    isOutdated: boolean;
    size?: number;
}