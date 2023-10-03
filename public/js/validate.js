// // Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const inputs = document.querySelectorAll('input[type=text],textarea')
    const user = document.querySelectorAll('.uniqueUser');
    const submitButton = document.querySelector('button[type="submit"]');
    const inps = document.querySelector('#image')
    const divv = document.querySelector('.maxImages')
    const maxFileSize = document.querySelector('.maxFileSize')
    let maxSize = 10485760;
    let currentSize = 0;
    let FL,allFiles;

    if(inputs){
      for(let i of inputs){  
        i.addEventListener('input',() =>{
        i.value = i.value.trimStart()})
      }}


    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        submitButton.setAttribute('disabled',true)
        if(inps){
          currentSize = 0;
          console.log(inps.files.length)
          allFiles = inps.files
          for(let fs of allFiles){
            currentSize += fs.size
          }
          FL = allFiles.length;
        }


        if(inputs){
          for(let i of inputs){  
            i.value = i.value.trim()}}


        if (!form.checkValidity() || FL > 3 || currentSize > maxSize) {
          event.preventDefault()
          event.stopPropagation()

          submitButton.removeAttribute('disabled');
          if(inps){
          if(FL > 3){
            divv.classList.add('show')
          }else{
              divv.classList.remove('show')
            }
            
          if(currentSize > maxSize){
            maxFileSize.classList.add('show')
          }else{
                maxFileSize.classList.remove('show')
          }  
          } 
          
        }

        form.classList.add('was-validated')        
      }, false)
    })
  })()


