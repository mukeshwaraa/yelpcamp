const calFrom = document.querySelector('.calendarFrom');
const calTo = document.querySelector('.calendarTo');
const change = document.querySelectorAll('#changer')
const date = new Date();
let day = date.getDate() + 1;
day = day > 9 ? day : "0"+day
let mon = date.getMonth() + 1;
mon = mon > 9 ? mon : "0"+mon
const year = date.getFullYear();
const miny = `${year}-${mon}-${day}`
const maxy = `${(year) + 1}-${mon}-${day}`
const attri = {
    min:miny,
    max:maxy
}
function setAttribute(e,attri){
    Object.keys(attri).forEach(attr => {
        e.setAttribute(attr,attri[attr])
    });
 
}


if(calFrom){
calFrom.addEventListener('change',() => dateSetter(attri))
setAttribute(calFrom,attri)
function dateSetter(a){
    calTo.removeAttribute('disabled')
    const m = calFrom.value
    calTo.setAttribute('min', m)
    calTo.setAttribute('max', a.max)

}}
if(change){
function load(to){
    location.href = to;
    } 
for(c of change){
let to = c.getAttribute('too')
c.addEventListener('click',() => load(to))}
}
