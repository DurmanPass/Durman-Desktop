export const ButtonSizes = {
    Small: { width: '80px', height: '30px' },
    Medium: { width: '120px', height: '40px' },
    Large: { width: '160px', height: '50px' },
    Long: {width: '400px', height: '60px'}
};

export type ButtonsSizesType = keyof typeof ButtonSizes;

export const DefaultButtonSize = "Medium";
