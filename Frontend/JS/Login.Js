const signUpButton = document.getElementById('signUp');
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

signUpButton.addEventListener('click', () => {
      window.location.href = "http://127.0.0.1:8080/Pages/signUp.html";
});

//toggle password

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const passtype = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', passtype);
    // toggle the eye slash icon
    this.classList.toggle('bi-eye')
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("rememberMe").checked;
        const gRecaptchaResponse = grecaptcha.getResponse();
        const grecaptchaError = document.getElementById("captcha-error");
        if (gRecaptchaResponse.length !== 0)
        {
            grecaptchaError.textContent = '';
            try {
                const response = await login(email, password, gRecaptchaResponse, rememberMe);
                console.log("JWT token:", response);
                if (response.message === "Login Successful"){
                    //alert("Login Successful")
                    window.location.href = "http://127.0.0.1:8080/Pages/LandingPage.html";
                }else{
                    errorMessage.textContent = await response.message;
                    throw new Error(response.message || 'Login Failed')
                }
    
                // Here, you can redirect the user to a protected page or perform other actions
            } catch (error){
                errorMessage.textContent = error.message
            }
        }
        else{
            grecaptchaError.textContent = 'Please verify you are not a robot.'
        }

    })
});

// Function to perform login and obtain JWT token
async function login(email, password, gRecaptchaResponse, rememberMe) {
    
        const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            email: email,
            password: password,
            g_recaptcha_response: gRecaptchaResponse,
            remember_me: rememberMe  // Pass rememberMe value to the server
        }),
        credentials: 'include'
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
    const responseData = await response.json();
    
    return responseData;     
}
