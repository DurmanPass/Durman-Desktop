export interface ReportCard {
    id: string;
    icon: string;
    title: string;
    description: string;
    action: () => Promise<string>;
    isEnabled?: boolean;
}