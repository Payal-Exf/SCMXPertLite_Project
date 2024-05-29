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

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById("signUpForm");
    const errorMessage = document.getElementById('error-message');

    signupForm.addEventListener('submit', async function(event){
        event.preventDefault();

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
                    window.location.href = "http://localhost:8080/Pages/Login.html";
                }else{
                    errorMessage.textContent = response.message;
                    throw new Error(response.message || 'Sign up failed')
                }
            }
        } catch (error){
            errorMessage.textContent = error.message
        }
    })
})


async function matchPassword(){
    var password = document.getElementById("id_password").value
    var confirmPassword = document.getElementById("passwordCon").value
    const errorMessage = document.getElementById('error-message');
    
    if (password.length !== 0 && confirmPassword.length !== 0){
        if (password === confirmPassword){
            //$(".error").fadeIn('slow', function(){
                //$(this).delay(3000).fadeOut('slow');
                return true
        
            // try {
            //     console.log("Password matched")
            //     alert("Password Matched")
            //     response = await signupUser(fullname, email, password, role);
            //     if (response.content["message"] === "User Created Successfully."){
            //         alert("User Signed up succesfully")
            //         window.location.href = "http://localhost:8080/Pages/Login.html";
            //     }else{
            //         errorMessage.textContent = response.content["Message"];
            //         throw new Error(response.content["Message"] || 'Sign up failed')
            //     }
                
            // }catch (error){
            //     // console.error('There There was a problem with the signup request:', error);
            //     // alert("There was a problem with the signup request. Please try again later.");
            //     errorMessage.textContent = error.message
            // }                      
        }
        else{
            errorMessage.textContent = "Passwords don\'t match"
            return false
            //console.log("Passwords don\'t match")
            //alert("Passwords don\'t match")
        }
    }
    else{
        //$(this).siblings('span.error').text('Enter the password').fadeIn().parent('.form-group').addClass('hasError');
        console.log("Enter password")
        alert("Enter Password")
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
    // else if (response.status === 400 || response.status === 400){
    //     const errorMessage = document.getElementById('error-message');
    //     const errorData = await response.json();
    //     errorMessage.textContent = await errorData.detail || 'Sign up failed'} 
    else{
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}   


const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signInButton.addEventListener('click', () => {
      
       // Redirect to a new page
        window.location.href = "http://localhost:8080/Pages/Login.html";
});

