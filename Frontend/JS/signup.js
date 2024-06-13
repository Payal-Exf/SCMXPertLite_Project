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

document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const errorMessage = document.getElementById('error-message');

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => element.textContent = '');

    // Validate fields
    let isValid = true;

    const fields = [
        'name', 'emailid', 'id_password', 'passwordCon'
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
        const fullname= document.getElementById("name").value
        const email= document.getElementById("emailid").value
        const role= document.getElementById("role").value
        
    
        try {
            passMatching = await matchPassword();
            if (passMatching){
                const response = await signupUser(fullname, email, password, role);
                if (response.message === "User Created Successfully."){
                    alert("User Signed up succesfully, Please login with your details.")
                    window.location.href = "./Login.html";
                }else{
                    errorMessage.textContent = response.message;
                    throw new Error(response.message || 'Sign up failed')
                }
            }
        } catch (error){
            errorMessage.textContent = error.message
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
async function signupUser(fullname, email, password, role){
    var newUser = {
        fullname: fullname,
        email: email,
        hashed_password: password,
        role: role
    };

    const response = await fetch('http://127.0.0.1:8000/signup/', {
        method :'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
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

