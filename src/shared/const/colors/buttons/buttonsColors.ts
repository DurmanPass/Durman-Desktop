export const ButtonsColors = {
    Primary: getComputedStyle(document.documentElement).getPropertyValue('--button-primary').trim() || 'rgb(92, 190, 231)',
    Secondary: getComputedStyle(document.documentElement).getPropertyValue('--button-secondary').trim() || 'rgb(4, 46, 125)',
    Accent: getComputedStyle(document.documentElement).getPropertyValue('--button-accent').trim() || 'rgb(3, 30, 91)',
    DarkOrange: getComputedStyle(document.documentElement).getPropertyValue('--button-dark-orange').trim() || 'rgb(204, 85, 0)',
    DeepPurple: getComputedStyle(document.documentElement).getPropertyValue('--button-deep-purple').trim() || 'rgb(128, 0, 128)',
    GradientBluePurple: getComputedStyle(document.documentElement).getPropertyValue('--button-gradient-blue-purple').trim() || 'linear-gradient(135deg, rgb(3, 30, 91), rgb(128, 0, 128))',
    GradientOrangeBlue: getComputedStyle(document.documentElement).getPropertyValue('--button-gradient-orange-blue').trim() || 'linear-gradient(135deg, rgb(204, 85, 0), rgb(92, 190, 231))',
    GradientDarkLight: getComputedStyle(document.documentElement).getPropertyValue('--button-gradient-dark-light').trim() || 'linear-gradient(135deg, rgb(2, 2, 2), rgb(255, 255, 255))',
    DarkGreen: 'rgb(15,198,15)',
};
export type ButtonsColorsType = keyof typeof ButtonsColors;
export const DefaultButtonColor = "Primary";