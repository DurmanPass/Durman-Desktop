export const WidgetSizes = {
    Small: { width: '100px', height: '300px' },
    Medium: { width: '450px', height: '140px' },
    Large: { width: '400px', height: '300px' },
    Long: {width: '500px', height: '300px'}
};

export type WidgetSizesType = keyof typeof WidgetSizes;

export const DefaultWidgetSize = "Medium";