const passwordWidgetTexts = [
    {
        title: 'Добавить новый пароль',
        description: 'Создайте сложный пароль и сохраните его в менеджере!'
    },
    {
        title: 'Добавьте новый пароль',
        description: 'Защитите свои аккаунты — создайте и сохраните пароль.'
    },
    {
        title: 'Безопасность начинается с пароля',
        description: 'Чем сложнее пароль, тем выше защита. Добавьте новый!'
    },
    {
        title: 'Каждый пароль — шаг к безопасности!',
        description: 'Больше уникальных паролей — крепче защита данных!'
    }
];

export function getRandomPasswordText() {
    return passwordWidgetTexts[Math.floor(Math.random() * passwordWidgetTexts.length)];
}