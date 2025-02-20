export function setRandomAnimation(): string {
    const animations = [
        'neon-glow-blue',
        'neon-glow-dark-orange',
        'neon-glow-deep-purple'
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    return animations[randomIndex];
}