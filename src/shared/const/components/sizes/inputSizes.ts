export const InputSizes = {
    Small: { width: '100px', height: '30px' },
    Medium: { width: '200px', height: '30px' },
    Large: { width: '300px', height: '40px' },
    Long: {width: '400px', height: '40px'}
};

export type InputSizesType = keyof typeof InputSizes;

export const DefaultInputSize = "Medium";