const show = document.querySelectorAll('.toShow')
const divElement = document.querySelector('.carouselImagess')
const header = document.querySelector('header')
// const toClose = document.querySelector('.carouselImagess.show')
window.addEventListener('keydown',(e) => {
    if(divElement.classList.contains('show')){
         divElement.classList.remove('show') 
         header.classList.remove('hide')    
    }
})
const Closebutton = document.querySelector('.closingButton') 
    

for(let s of show){  
      s.addEventListener('click',() =>{
        divElement.classList.add('show')
        header.classList.add('hide')
    })
   
}
Closebutton.addEventListener('click',() =>{
    divElement.classList.remove('show')
    header.classList.remove('hide')
})