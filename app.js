const MonthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MonthArrStr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
function kalendar(){
let currentDate = new Date();
const today = currentDate.getDate();
const month = currentDate.getMonth();
const month1 = document.getElementById('month1');
month1.textContent = MonthArrStr[month];
month1.colSpan = MonthArr[month]-today +1;
const month2 = document.getElementById('month2');
month2.textContent = MonthArrStr[month+1];
month2.colSpan = 31-MonthArr[month]+today;
let count=1;
   let headerCount = 1;
for (let i = today; i <= MonthArr[month]; i++) {
    const hdayElements = document.querySelectorAll('th.day' + count);
    hdayElements[0].textContent = i;
    count++;
}
for(let i=1; i<=MonthArr[month+1]&&count<=30; i++)
{
  const hdayElements = document.querySelectorAll('th.day' + count);
  hdayElements[0].textContent = i; 
  count++;
}
const trCount = document.querySelectorAll('tbody tr').length;
for (let j = 1; j <= trCount; j++) {
    count = 1; 
    for (let i = today; i <= MonthArr[month]; i++) {
        const ddayElements = document.querySelectorAll('tr.row' + j + ' td.day' + count);
        ddayElements[0].textContent = i;
        count++;
    }
}
let countend=count;
    for (let j = 1; j <= trCount; j++) {
    count = countend;
    for (let i = 1; i <= MonthArr[month + 1] && count <= 30; i++) {
        const ddayElementsNextMonth = document.querySelectorAll('tr.row' + j + ' td.day' + count);
        ddayElementsNextMonth[0].textContent = i;
        count++;
    }
}
}
function mesac(){
const month1=document.getElementById('month1');
const monthColspan = parseInt(month1.getAttribute('colspan'), 10);
var month1Number;
var month2Number;
const rows = document.querySelectorAll('tbody tr');
for(let i=0; i<12; i++)
    {
        if(month1.textContent===(MonthArrStr[i]))
        {
            month1Number=i+1;
            month2Number=i+2;
            break;
        }
    } 
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        for(let i=1; i<=monthColspan; i++)
        {
        cells[i].classList.add(month1Number); 
        }
        for(let i=monthColspan+1; i<=30; i++)
            {
            cells[i].classList.add(month2Number); 
            }
    });
}
const range = [
    { start: '23.02', end: '28.02', status: 'занято' }
];

function getMonthFromDate(dateString) {
    const [day, month] = dateString.split('.'); 
    return Number(month); 
}
function getDayFromDate(dateString) {
    const [day, month] = dateString.split('.'); 
    return Number(day); 
}

function CellsStatus() {
    const startMonth = getMonthFromDate(range.start);
    const endMonth = getMonthFromDate(range.end);
    const startCells = document.querySelectorAll('tbody tr.row1 td.'+ startMonth); 
    const endCells = document.querySelectorAll('tbody tr.row1 td.'+ endMonth); 
    if(startMonth==endMonth)
    {
    startCells.forEach(cell => {
        const cellDay = parseInt(cell.textContent, 10);
        dateRanges.forEach(range => {
            if (cellDay >= getDayFromDate(range.start) && cellDay <= getDayFromDate(range.end)) {
                cell.style.backgroundColor = 'rgb(255, 117, 117)'; 
                cell.textContent += ` (${range.status})`; 
            }
        });
    });
}
}
