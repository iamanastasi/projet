function insertText(targetId, storageKey) {
    const savedText = localStorage.getItem(storageKey);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        if (savedText) {
            targetElement.innerText = savedText; 
        } else {
            console.warn('Нет данных для вставки.');
        }
    } else {
        console.error(`Элемент с id '${targetId}' не найден.`);
    }
}