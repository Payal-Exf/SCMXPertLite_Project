document.addEventListener('DOMContentLoaded', () => {
    const fullNameElement = document.getElementById('fullname');
    const emailElement = document.getElementById('email')
    const roleElement = document.getElementById('role')
    const userNameElement = document.getElementById('username')
    const token = getCookie('access_token');
    //function to display user's Name    
    function fetchUserDetails(){
        if (token) {
            const payload = parseJwt(token);
            console.log("fullname: " + payload.fullname + " email: " + payload.sub + " role " + payload.role
            )
            if (payload){
                userNameElement.textContent = `Hi ${payload.fullname.toString().toUpperCase()}, Welcome to SCMXPertLite`;
                fullNameElement.value = payload.fullname.toString().toUpperCase();
                emailElement.value = payload.sub;
                roleElement.value = payload.role.toString().toUpperCase();
            }else{
                // userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite';
                alert("Token Expired, Please Relogin.")
                window.location.href = './Login.html';
            }
        }else{
            alert("Unauthorized Access, Please Login.")
            window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
        }
    } 

    //Function to parse JWT Token
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    }

    //Function to get Cookie by name
    function getCookie(name){
        try{
            let CookieArr = document.cookie.split(";");
            for (let i = 0; i < CookieArr.length; i++) {
                let CookiePair = CookieArr[i].split("=");
                if (name === CookiePair[0].trim()) {                   
                    return decodeURIComponent(CookiePair[1]);
                }
            }
            console.log('Cookie Not found: ', name);
            return null;

        }catch(error){
            console.error('Error retrieving Cookie:', error);
            return null;
        }
    }

    fetchUserDetails();
});

function editProfile() {
    // Implement edit profile functionality
    alert('Edit profile feature coming soon!');
}
