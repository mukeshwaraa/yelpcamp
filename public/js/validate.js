// Example starter JavaScript for disabling form submissions if there are invalid fields

(() => {
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const user = document.querySelectorAll('.uniqueUser');
    const submitButton = document.querySelector('button[type="submit"]');
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        submitButton.setAttribute('disabled',true)
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          submitButton.removeAttribute('disabled');
        }
        
        form.classList.add('was-validated')
        
      }, false)
    })
  })()

