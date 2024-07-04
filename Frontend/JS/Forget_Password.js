//toggle password
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#id_password');

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const passtype = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', passtype);
    // toggle the eye slash icon
    this.classList.toggle('bi-eye')
});


//Toggle Confirm Password
const toggleConfPassword = document.querySelector('#toggleConfPassword');
const confPassword = document.querySelector('#passwordCon')

toggleConfPassword.addEventListener('click', function(e){
    const Confpasstype = confPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confPassword.setAttribute('type', Confpasstype);
    // toggle the eye slash icon
    this.classList.toggle('bi-eye')
});

document.getElementById('forgetPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const errorMessage = document.getElementById('error-message');

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => element.textContent = '');

    // Validate fields
    let isValid = true;

    const fields = [
         'emailid', 'id_password', 'passwordCon'
    ];
    fields.forEach(field => {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(`${field}_error`);
        if (!input.value.trim()) {
            isValid = false;
            errorElement.textContent = `${field.replace(/_/g, ' ').toUpperCase()} is required`;
        }
    });

    if (isValid) {

        const password = document.getElementById("id_password").value
        const email= document.getElementById("emailid").value        
    
        try {
            passMatching = await matchPassword();
            if (passMatching){
                const response = await forgetPassword(email, password);
                if (response.message === "Password Changed Successfully."){
                    //alert("Password Changed Successfully. Please login with your new credentials.")
                    Swal.fire({
                        title: 'Password Changed Successfully',
                        text: 'Please login with your new credentials.!',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        customClass: {
                        popup: 'swal-popup',
                        title: 'swal-title',
                        content: 'swal-content',
                        confirmButton: 'swal-confirm-button'
                        }
                    }).then((result)=>{
                        if(result.isConfirmed){
                            window.location.href='./Login.html'
                        }
                    })
                    //window.location.href = "./Login.html";
                }else{
                    errorMessage.textContent = response.message;
                    //throw new Error(response.message || 'Changing Password Failed')
                    Swal.fire({
                        title: 'Oops!',
                        text: (response.message || 'Changing Password Failed'),
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        customClass: {
                        popup: 'swal-popup',
                        title: 'swal-title',
                        content: 'swal-content',
                        confirmButton: 'swal-confirm-button'
                        }
                    });
                }
            }
        } catch (error){
            errorMessage.textContent = error.message
            Swal.fire({
                title: 'Oops!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-button'
                }
            });
        }
    }
});


async function matchPassword(){
    var password = document.getElementById("id_password").value
    var confirmPassword = document.getElementById("passwordCon").value
    const errorMessage = document.getElementById('error-message');
    
    if (password.length !== 0 && confirmPassword.length !== 0){
        if (password === confirmPassword){
                return true
        }
        else{
            errorMessage.textContent = "Passwords don\'t match"
            return false
        }
    }
    else{
        console.log("Enter password")
        errorMessage.textContent = "Enter password"
    }
}

//post
async function forgetPassword(email, password){

    const response = await fetch('http://127.0.0.1:8000/forget_password/', {
        method :'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            email: email,
            password: password
        }),
        credentials: 'include'
    });
    if (response.ok){
        const responseData = await response.json();
        
        return responseData
       
    }
    else{
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}   


const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signInButton.addEventListener('click', () => {
      
       // Redirect to a new page
        window.location.href = "./Login.html";
});

