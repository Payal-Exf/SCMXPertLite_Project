// //get

// fetch('http://127.0.0.1:8000/')
//     .then(res=> {
//         if (!res.ok){
//             console.log('Problem');
//             return;
//         }
//         return  res.json()
//     })
//     .then(data => {
//         console.log(data)
//     })
//     .catch(error => {
//     console.log(error);
// })


// fetch('http://127.0.0.1:8000/signup/', {
//     method :'POST',
//     headers:
//     {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(newUser)
// }).then(res=> {
//     if (!res.ok){
//         console.log('Problem');
//         return;
//     }
//     return  res.json()
// })
// .then(data => {
//     console.log(data)
// })
// .catch(error => {
// console.log(error);
// })



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

async function matchPassword(){
    var password = document.getElementById("id_password").value
    var confirmPassword = document.getElementById("passwordCon").value
    var fullname= document.getElementById("name").value
    var email= document.getElementById("emailid").value
    var role= document.getElementById("role").value

    if (password.length !== 0 && confirmPassword.length !== 0){
        if (password === confirmPassword){
            //$(".error").fadeIn('slow', function(){
                //$(this).delay(3000).fadeOut('slow');
            try {
                console.log("Password matched")
                alert("Password Matched")
                await signupUser(fullname, email, password, role);
                alert("User Signed up succesfully")
            }catch (error){
                console.error('There There was a problem with the signup request:', error);
                alert("There was a problem with the signup request. Please try again later.");
            }                      
        }
        else{
            console.log("Passwords don\'t match")
            alert("Passwords don\'t match") 
        }
    }
    else{
        //$(this).siblings('span.error').text('Enter the password').fadeIn().parent('.form-group').addClass('hasError');
        console.log("Enter password")
        alert("Enter Password")
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
        alert('Sign up Successful!. Please login')
        window.location.href = "http://localhost:8080/Pages/Login.html"
        return await response.json();
       
    }else if (response.status === 400 || response.status === 400){
        const errorMessage = document.getElementById('error-message');
        const errorData = await response.json();
        errorMessage.textContent = errorData.detail || 'Sign up failed'
    }else{
        throw new Error('Request failed with status: ' + response.status);
    }
}   





// // Form validation
// document.getElementsByTagName('input').blur(function () {
// function validateform(){
//     let username = document.forms["signUpForm"]["username"].value;
//     if (username.length === 0){
//         //alert("Please type your full name")
//         $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
//         usernameError = true 
//     }
// }

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signInButton.addEventListener('click', () => {
      //container.classList.add('right-panel-active');
       // Redirect to a new page
        window.location.href = "http://localhost:8080/Pages/Login.html";
});

// signUpButton.addEventListener('click', () => {
//       container.classList.remove('right-panel-active');
// });