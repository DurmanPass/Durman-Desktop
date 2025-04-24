export interface TreeNode {
    id: string;
    type: 'root' | 'category' | 'email' | 'password';
    label: string;
    color?: string;
    strength?: number;
    size?: number;
    children?: TreeNode[];
    parent?: TreeNode;
    collapsed?: boolean;
}