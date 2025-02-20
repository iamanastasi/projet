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

const month1=document.getElementById('month1');
const monthColspan = month1.getAttribute('colspan');
var month1Number;
var month2Number;
for(let i=0; i<12; i++)
    {
        if(month1.textContent.equals(MonthArrStr[i]))
        {
            month1Number=i+1;
            month2Number=i+2;
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
const dateRanges = [
    { start: '17.02', end: '19.02', status: 'занято' }
];

 
function CellsStatus() {
    const cells = document.querySelectorAll('tbody tr.row1 td'); 
    const month1 = document.getElementById('month1');
    const month2 = document.getElementById('month2');
    cells.forEach(cell => {
        const cellDate = cell.textContent; 

        dateRanges.forEach(range => {
            if (cellDate >= range.start && cellDate <= range.end) {
                cell.style.backgroundColor = 'rgb(255, 117, 117)'; 
                cell.textContent += ` (${range.status})`; 
            }
        });
    });
}
