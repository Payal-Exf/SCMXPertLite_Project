document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('username');
    const token = getCookie('access_token');
    //function to display user's Name    
    function displayUserDetails(){
        if (token) {
            const payload = parseJwt(token);
            console.log("fullname: " + payload.fullname + "," + 
            "role: " + payload.role + "," + 
            "email: " +  payload.sub)
            if (payload.fullname){
                userNameElement.textContent = `Hi ${payload.fullname.toString().toUpperCase()}, Welcome to SCMXPertLite`;
                return {"fullname": payload.fullname, "role": payload.role, "email": payload.sub}
            }else{
                
                Swal.fire({
                    title: 'Oops!',
                    text: 'Token Expired, Please Relogin.',
                    icon: 'error',
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
            }
        }else{
            
            window.location.href = './Login.html';
            Swal.fire({
                title: 'Oops!',
                text: 'Unauthorized Access, Please Login.',
                icon: 'error',
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

    displayUserDetails();
});