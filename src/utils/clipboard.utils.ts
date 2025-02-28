export function copyToClipboard(text: string): void {
    if (!navigator.clipboard) {
        // Если Clipboard API недоступен, используем запасной вариант
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy'); // Старый метод копирования
        } catch (err) {
            console.error('Ошибка при копировании в буфер обмена:', err);
        }
        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => console.log('Текст успешно скопирован!'))
        .catch(err => console.error('Ошибка при копировании в буфер:', err));
}