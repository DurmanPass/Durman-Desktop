export const ButtonSizes = {
    Small: { width: '80px', height: '30px' },
    Medium: { width: '150px', height: '40px' },
    Large: { width: '160px', height: '50px' },
    Long: {width: '400px', height: '60px'},
    RoundSmall: {width: '25px', height: '25px'}
};

export type ButtonsSizesType = keyof typeof ButtonSizes;

export const DefaultButtonSize = "Medium";

// Метод для получения ширины с делением
export function getWidthButtonSize(size: ButtonsSizesType): number {
    return parseInt(ButtonSizes[size].width, 10);
}

// Метод для получения высоты с делением
export function getHeightButtonSize(size: ButtonsSizesType): number {
    return parseInt(ButtonSizes[size].height, 10);
}