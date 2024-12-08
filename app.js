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
function saveEdits(targetId) {
    const text = document.getElementById(targetId).value;
    localStorage.setItem(targetId, text);
    alert("Текст сохранен!");
}
window.onload = () => {
    const savedText = localStorage.getItem(targetId);
    if (savedText) {
        document.getElementById(targetId).value = savedText;
    }
};