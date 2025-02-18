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
