// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const user = document.querySelectorAll('.uniqueUser');
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        console.log("hai");
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

  
        form.classList.add('was-validated')
      }, false)
    })
  })()

