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
        let startNomer =startDay-today;
        let endNomer =endDay-today;
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
            let startNomer =startDay-today+MonthArr[month];
            let endNomer =endDay-today+MonthArr[month];
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
        let startNomer =startDay-today;
        let endNomer=1;
        if(startMonth==month)
            {
                startNomer =0;
                endNomer =endDay-today;
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

function getMesac() {
    const selectElement = document.getElementById('mesac');
    return parseInt(selectElement.value)-1;
}
function getYear() {
    const selectElement = document.getElementById('year');
    return selectElement.value;
}

function createKalendar(month, year) {
    console.log(month ,MonthArr[month]);
let firstDate = new Date( year, month, 1);
let startDay=firstDate.getDay();
if(startDay==0)
{
startDay=7;
}
const ddayElements = document.querySelectorAll('tr td');
ddayElements.forEach(td => td.textContent = '');
let i = 1;
for (let j = startDay - 1; j < ddayElements.length && i <= MonthArr[month]; j++) {
ddayElements[j].textContent = i;
i++;
}
return startDay;
}

function CellsStatusClient(rangestart, rangeend) {
    const startMonth = getMonthFromDate(rangestart);
    const endMonth = getMonthFromDate(rangeend);
    const startDay = getDayFromDate(rangestart);
    const endDay = getDayFromDate(rangeend);
    const m = getMesac()+1;
    const firstNomer = createKalendar(m-1, getYear());
    const cells = document.querySelectorAll('tbody tr td');
    let startNomer = startDay + firstNomer - 1;
    let endNomer = endDay + firstNomer - 1;
    if (startMonth < m) {
        startNomer = firstNomer; 
    }
    if (endMonth > m) {
        endNomer = firstNomer + MonthArr[m-1] - 1; 
    }
    console.log(m, startMonth, startDay, endDay, startNomer, endNomer);
    for (let i = startNomer-1; i < endNomer; i++) {
        if (cells[i]) {
            cells[i].style.backgroundColor = 'rgb(255, 117, 117)';
        }
    }
}

function getDatesClient() {
    const MON = getMesac()+1;
    const PropertyID = 1;
        const cells = document.querySelectorAll('#kalendar td');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    fetch(`http://localhost:3000/bookings-by-month?month=${MON}&PropertyID=${PropertyID}`)
        .then(response => response.json())
        .then(data => {
            console.log('Bookings:', data);
            data.forEach(booking => {
                CellsStatusClient(booking.StartDate, booking.EndDate);
            });
        })
        .catch(error => console.error('Error:', error));
}

      function removeStatus(){
        const cells = document.querySelectorAll('#kalendar td');
          cells.forEach(cell => cell.classList.remove('selected'));
      }
    
      function selectCell(event) {
          const cells = document.querySelectorAll('#kalendar td');
          cells.forEach(cell => cell.classList.remove('selected'));
          const selectedCell = event.target;
          selectedCell.classList.add('selected'); 
          selectionCount++;
    
          if (selectionCount === 3) 
          {
              selectionCount = 1;
          }
    
          if (selectionCount === 1) 
          {
            let m=(getMesac()+1).toString();
              cellStart = getYear()+'-'+m.padStart(2, '0')+'-'+ selectedCell.textContent.padStart(2, '0');
          }
    
          if (selectionCount === 2) 
          {
            let m=(getMesac()+1).toString();
              cellEnd = getYear()+'-'+m.padStart(2, '0')+'-'+selectedCell.textContent.padStart(2, '0');
              startDateSpan.textContent = cellStart;
              endDateSpan.textContent = cellEnd;
              modal.style.display = 'block';
          }
    
          console.log('Выделенная ячейка:', selectedCell.textContent, selectionCount);
      }
      
      function workingKalendar()
      {
        createKalendar(getMesac(), getYear());
      let selectionCount = 0;
      var cellStart, cellEnd;
      const modal = document.getElementById('modal');
      const startDateSpan = document.getElementById('startDate');
      const endDateSpan = document.getElementById('endDate');
      const closeModal = document.querySelector('.close');
      closeModal.onclick = function(){
        modal.style.display = 'none';
    };
    window.onclick = function(event){
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    const cells = document.querySelectorAll('#kalendar td');
    cells.forEach(cell => {
        cell.addEventListener('click', selectCell);
    });
    document.getElementById('br').addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.setItem('startDate', cellStart);
  localStorage.setItem('endDate', cellEnd);
  window.location.href = 'clientbook.html';
});
    getDatesClient();
      }