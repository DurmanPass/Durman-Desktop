// Массив объектов с вариантами приветствий
export const GreetingsHomeTab = [
    {
        title: "Общий привет, {email}!",
        description: "Твои пароли под надёжной защитой. Готов проверить их состояние?"
    },
    {
        title: "Привет, {email}!",
        description: "Твои секреты в безопасности, но не забывай их иногда обновлять!"
    },
    {
        title: "С возвращением, {email}!",
        description: "Всё на месте, но, может, пора усилить пару слабых звеньев?"
    },
    {
        title: "Рад видеть, {email}!",
        description: "Твои пароли ждут тебя — давай сделаем их ещё круче!"
    },
    {
        title: "Здравствуй, {email}!",
        description: "Твой цифровой сейф в порядке. Что проверим сегодня?"
    }
];

// Функция для случайного выбора приветствия и подстановки email
export function getRandomGreetingHomeTab(email: string) {
    const randomIndex = Math.floor(Math.random() * GreetingsHomeTab.length); // Случайный индекс
    const selectedGreeting = GreetingsHomeTab[randomIndex];

    return {
        title: selectedGreeting.title.replace("{email}", email), // Подставляем email
        description: selectedGreeting.description
    };
}