export const LabelSide = {
  Bottom: "Bottom",
  Top: "Top",
  Right: "Right",
  Left: "Left"
} as const;
export type LabelSideType = keyof typeof LabelSide;
export const DefaultLabelSide = LabelSide.Top;