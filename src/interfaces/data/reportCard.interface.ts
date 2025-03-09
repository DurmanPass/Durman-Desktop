export interface ReportCard {
    id: string;
    icon: string;
    title: string;
    description: string;
    action: () => void;
    isEnabled?: boolean;
}