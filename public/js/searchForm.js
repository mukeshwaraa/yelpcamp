// const { default: axios } = require("axios")

const searchForm = document.querySelector('.searchForm')
const searchForm2 = document.querySelector('.searchForm2')
const show = document.querySelector('.searchBox')
const showBox = document.querySelector('.searchBoxContainer')
let searchResult = document.querySelector('.searchResult')
const header = document.querySelector('header')
const form = document.querySelector('.submitForm')
const b = document.querySelector('.submitButton')
const Closebutton = document.querySelector('.closingButton') 
window.addEventListener('keydown',(e) => {
    if(e.key === "Escape" && show.classList.contains('show')){
         show.classList.remove('show')     
         header.classList.remove('hide')    
    }
})

searchForm.addEventListener('click',() =>{
  show.classList.add('show')
  header.classList.add('hide')  
})
Closebutton.addEventListener('click',() =>{
    show.classList.remove('show')
    header.classList.remove('hide')
   
})

searchForm2.addEventListener('input',async function(){
    showBox.innerHTML=""
    try{
    const response = await axios.get("/camps/search",{params:{q:this.value}})
 
    if(response.data.length){
        const d = document.createElement('div');
        d.classList.add('searchResult');
        const ul = document.createElement('ul');
        ul.classList.add('list-group','list-group-flush');
        response.data.forEach((d) => {
            const li = document.createElement('LI')
            li.classList.add('list-group-item','d-inline')
            const a = document.createElement('a')
            a.innerText = d.name
            a.setAttribute('href',`/camps/${d._id}`)
            li.append(a)
            ul.append(li)
 
        });
        d.append(ul)
        showBox.append(d)           
    }
}
    
    catch(e){
        
    }
})