export const TextAlign = {
    Left: "Left",
    Right: "Right",
    Center: "Center",
} as const;
export type TextAlignType = keyof typeof TextAlign;
export const DefaultTextAlign = TextAlign.Left;