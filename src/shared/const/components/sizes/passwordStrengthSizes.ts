export const PasswordStrengthBarSizes = {
    Small: { width: '70px', height: '30px' },
    Medium: { width: '200px', height: '10px' },
    Large: { width: '300px', height: '30px' },
    Long: {width: '400px', height: '30px'}
};

export type PasswordStrengthSizesType = keyof typeof PasswordStrengthBarSizes;

export const DefaultPasswordStrengthSize = "Medium";