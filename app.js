const MonthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MonthArrStr = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const rows = document.querySelectorAll('tbody tr');
let currentDate = new Date();
const today = currentDate.getDate();
const month = currentDate.getMonth();
console.log(today, month);

function kalendar(){
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
console.log(monthColspan);
var month1Number;
var month2Number;
for(let i=0; i<12; i++)
    {
        if(month1.textContent===(MonthArrStr[i]))
        {
            month1Number=i+1;
            month2Number=i+2;
            console.log(month1Number, month2Number);
            break;
        }
    } 
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        for(let i=1; i<=monthColspan; i++)
        {
        cells[i].classList.add(month1Number.toString()); 
        }
        for(let i=monthColspan+1; i<=30; i++)
            {
            cells[i].classList.add(month2Number.toString()); 
            }
    });
    console.log("succes");
    const flag=document.getElementById('flag');
    console.log(flag.className);
}

let rangestart, rangeend;

function getDates(){
fetch('http://localhost:3000/api/mydatabase')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(booking => {
            const rangestart = booking.StartDate;
            const rangeend = booking.EndDate;
            const propertyrow = booking.PropertyID;
            console.log(rangestart, rangeend, propertyrow);
            CellsStatus(rangestart, rangeend, propertyrow);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function getMonthFromDate(dateString) {
    console.log(dateString);
    const [year, month, day] = dateString.split('-'); 
    return Number(month); 
}
function getDayFromDate(dateString) {
    console.log(dateString);
    const [year, month, day] = dateString.split('-'); 
    return Number(day); 
}

function CellsStatus(rangestart, rangeend, propertyrow) {
    const startMonth = getMonthFromDate(rangestart);
    const endMonth = getMonthFromDate(rangeend);
    const startDay = getDayFromDate(rangestart);
    const endDay = getDayFromDate(rangeend);
    const cells = document.querySelectorAll('tbody tr.row'+propertyrow+' td'); 
    if(startMonth==month+1&&endMonth==month+1)
    {
        const startNomer =startDay-today;
        const endNomer =endDay-today;
        if(startDay<today)
            {
                endNomer =endDay-today;
                startNomer =today;
            }
        console.log(today, startDay, endDay, startNomer, endNomer);
        for(let i=startNomer+1; i<=endNomer+1; i++)
        {
            cells[i].style.backgroundColor = 'rgb(255, 117, 117)'; 
        }
    }
    if(startMonth==month+2&&endMonth==month+2)
        {
            const startNomer =startDay-today+MonthArr[month];
            const endNomer =endDay-today+MonthArr[month];
            if(endDay>30+MonthArr[month]-today)
                {
                    endNomer =29;
                }
            console.log(today, startDay, endDay, startNomer, endNomer);
            for(let i=startNomer+1; i<=endNomer+1; i++)
            {
                cells[i].style.backgroundColor = 'rgb(255, 117, 117)'; 
            }
        }
    if(startMonth!=endMonth) 
    {
        const startNomer =startDay-today;
        const endNomer =endDay-today+MonthArr[month];
        if(startMonth==month+1&&startDay<today)
            {
                startNomer =today;
            }
        if(startMonth==month+2&&endDay>30+MonthArr[month]-today)
            {
                endNomer =30;
            }
        console.log(today, startDay, endDay, startNomer, endNomer);
        for(let i=startNomer+1; i<=endNomer+1 ; i++)
        {
            cells[i].style.backgroundColor = 'rgb(255, 117, 117)'; 
        }
    }
}
