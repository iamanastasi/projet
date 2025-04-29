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
            CellsStatus(rangestart, rangeend, propertyrow, 1);
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

function CellsStatus(rangestart, rangeend, propertyrow, status) {
    if(status==1)
    {
        let color='rgb(255, 117, 117)';
    }
    else if (status==2)
    {
        let color='rgb(49, 133, 85)';
    }
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
            cells[i].style.backgroundColor = color; 
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
                cells[i].style.backgroundColor = color; 
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
            cells[i].style.backgroundColor = color; 
        }
    }
}

function getMesac(nom) {
    const selectElement = document.getElementById('mesac'+nom);
    return parseInt(selectElement.value)-1;
}
function getYear(nom) {
    const selectElement = document.getElementById('year'+nom);
    return selectElement.value;
}

function createKalendar(month, year, nom) {
    console.log(month ,MonthArr[month]);
let firstDate = new Date( year, month, 1);
let startDay=firstDate.getDay();
if(startDay==0)
{
startDay=7;
}
const ddayElements = document.querySelectorAll('#kalendar' + nom +' tr td');
ddayElements.forEach(td => td.textContent = '');
let i = 1;
for (let j = startDay - 1; j < ddayElements.length && i <= MonthArr[month]; j++) {
ddayElements[j].textContent = i;
i++;
}
return startDay;
}

function CellsStatusClient(rangestart, rangeend, nom, status) {
    let stat;
    if(status==1)
    {
     stat='no';   
    }
    else if (status==2)
        {
         stat='mb';   
        }
    const startMonth = getMonthFromDate(rangestart);
    const endMonth = getMonthFromDate(rangeend);
    const startDay = getDayFromDate(rangestart);
    const endDay = getDayFromDate(rangeend);
    const m = getMesac(nom)+1;
    const firstNomer = createKalendar(m-1, getYear(nom),nom);
    const cells = document.querySelectorAll('#kalendar' + nom +' tbody tr td');
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
            cells[i].classList.add(stat);
            
        }
    }
}

function getDatesClient(nom) {
    const MON = getMesac(nom)+1;
    const PropertyID = nom;
        const cells = document.querySelectorAll('#kalendar'+nom+' td');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    fetch(`http://localhost:3000/bookings-by-month?month=${MON}&PropertyID=${PropertyID}`)
        .then(response => response.json())
        .then(data => {
            console.log('Bookings:', data);
            data.forEach(booking => {
                CellsStatusClient(booking.StartDate, booking.EndDate, nom, 1);
            });
        })
        .catch(error => console.error('Error:', error));
}

      function removeStatus(nom){
        const cells = document.querySelectorAll('#kalendar'+nom+ ' td');
          cells.forEach(cell => cell.classList.remove('selected'));
      }
     
      const selectionCount = { 1: 0, 2: 0 };
let cellStart = { 1: '', 2: '' };
let cellEnd = { 1: '', 2: '' };
let modal = { 1: null, 2: null };
let startDateSpan = { 1: null, 2: null };
let endDateSpan = { 1: null, 2: null };
let totalPriceSpan = { 1: null, 2: null };
let dCheck1 = { 1: null, 2: null };
let dCheck2 = { 1: null, 2: null };

async function selectCell(event, nom) {
    const cells = document.querySelectorAll('#kalendar'+nom+ ' td');
    const selectedCell = event.target;
    
    cells.forEach(cell => cell.classList.remove('selected'));
    selectedCell.classList.add('selected'); 
    selectionCount[nom]++;
    
    if (selectionCount[nom] === 3) 
    {
        selectionCount[nom] = 1;
    }
    
    const day = selectedCell.textContent.padStart(2, '0');
    const month = (getMesac(nom)+1).toString().padStart(2, '0');
    const year = getYear(nom);
    const dateStr = `${year}-${month}-${day}`;
    const dateCheck = new Date(year, month-1, day);
    
    if (selectionCount[nom] === 1) {
        cellStart[nom] = dateStr;
        dCheck1[nom]=dateCheck;
        const cells = document.querySelectorAll('#kalendar'+nom+ ' td');
        cells.forEach(cell => cell.classList.remove('mb'));
    } else if (selectionCount[nom] === 2) {
        cellEnd[nom] = dateStr;
        dCheck2[nom]=dateCheck;
        if(dCheck1[nom]>dCheck2[nom])
        {
            let helpdate=cellStart[nom];
            cellStart[nom]=cellEnd[nom];
            cellEnd[nom]=helpdate;
        }
        CellsStatusClient(cellStart[nom], cellEnd[nom], nom, 2);
        startDateSpan[nom].textContent = cellStart[nom];
        endDateSpan[nom].textContent = cellEnd[nom];
        let totalPrice = await calculatePrice(nom, cellStart[nom], cellEnd[nom]); 
        console.log(totalPrice);
        totalPriceSpan[nom].textContent = totalPrice.toString();
        localStorage.setItem('totalPrice' + nom, totalPrice);

        modal[nom].style.display = 'block';
    }
    console.log('Выделенная ячейка:', selectedCell.textContent, selectionCount[nom]);  
}
function workingKalendar(nom) {
    createKalendar(getMesac(nom), getYear(nom), nom);
    selectionCount[nom] = 0;
    cellStart[nom] = '';
    cellEnd[nom] = '';
    modal[nom] = document.getElementById('modal' + nom);
    startDateSpan[nom] = document.getElementById('startDate' + nom);
    endDateSpan[nom] = document.getElementById('endDate' + nom);
    totalPriceSpan[nom] = document.getElementById('totalPrice' + nom);
    const closeModal = document.querySelector('.close' + nom);

    closeModal.onclick = function () {
        modal[nom].style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal[nom]) {
            modal[nom].style.display = 'none';
        }
    };

    const cells = document.querySelectorAll('#kalendar' + nom + ' td');
    cells.forEach(cell => {
        cell.addEventListener('click', (event) => selectCell(event, nom));
    });

    
    const brElement = document.getElementById('br' + nom);
        brElement.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.setItem('startDate' + nom, cellStart[nom]);
            localStorage.setItem('endDate' + nom, cellEnd[nom]);
            localStorage.setItem('propertyNumber', nom.toString());
            window.location.href = 'clientbook.html';
        });
        
    getDatesClient(nom);
}
async function calculatePrice(propertyId, startDate, endDate) {
    try {

        const url = `http://localhost:3000/api/calculate?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const data = await response.json();        
        return data.total || 0;
                                          
    } catch (error){
        console.error('Ошибка при расчете цены:', {
            error: error.message,
            request: { propertyId, startDate, endDate },
            timestamp: new Date().toISOString()
        });
        return 0;
    }
}