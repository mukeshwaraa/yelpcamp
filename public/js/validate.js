// // Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const user = document.querySelectorAll('.uniqueUser');
    const submitButton = document.querySelector('button[type="submit"]');
    const inps = document.querySelector('#image')
    const divv = document.querySelector('.maxImages')
    let FL;
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        submitButton.setAttribute('disabled',true)
        if(inps){
          console.log(inps.files.length)
          FL = inps.files.length;
        }


        if (!form.checkValidity() || FL > 3) {
          event.preventDefault()
          event.stopPropagation()
          submitButton.removeAttribute('disabled');
          if(inps){
          if(FL > 3){
            divv.classList.add('show')
          }else{
              divv.classList.remove('show')
            }}
        }

        form.classList.add('was-validated')        
      }, false)
    })
  })()



// (() => {
//   'use strict'

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll('.needs-validation')

//   // Loop over them and prevent submission
//   Array.from(forms).forEach(form => {
//     form.addEventListener('submit', event => {
//       if (!form.checkValidity()) {
//         event.preventDefault()
//         event.stopPropagation()
//       }

//       form.classList.add('was-validated')
//     }, false)
//   })
// })()