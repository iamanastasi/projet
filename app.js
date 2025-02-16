let currentDate = new Date();
console.log(currentDate.getFullYear());
console.log(currentDate.getMonth());
console.log(currentDate.getDate());
console.log(currentDate);
const MonthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
today=currentDate.getDate();
tomonth=currentDate.getMonth();
count =1;
for(let i=today; i<MonthArr[tomonth]; i++)
{
document.getElementById('day'+count.toString()).textContent= i;
count++;
}
// Пример данных о временных промежутках
const dateRanges = [
    { start: '17.02', end: '19.02', status: 'занято' }
];

// Функция для изменения цвета ячеек в календаре
function highlightCells() {
    const cells = document.querySelectorAll('tbody td'); // Получаем все ячейки в таблице

    cells.forEach(cell => {
        const cellDate = cell.textContent; // Получаем дату из ячейки

        dateRanges.forEach(range => {
            // Проверяем, попадает ли дата в указанный диапазон
            if (cellDate >= range.start && cellDate <= range.end) {
                cell.style.backgroundColor = 'yellow'; // Изменяем цвет фона
                cell.textContent += ` (${range.status})`; // Обновляем текст ячейки
            }
        });
    });
}

// Вызываем функцию для изменения цвета ячеек
highlightCells();