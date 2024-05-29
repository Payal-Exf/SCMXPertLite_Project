document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentBody = document.getElementById('content-body');
    const userNameElement = document.getElementById('user-name');
    const token = getCookie('access_token');

    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            loadContent(item.getAttribute('href'));
        });
    });

    function loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentBody.innerHTML = html;
            })
            .catch(error => {
                contentBody.innerHTML = '<h2>Error</h2><p>Unable to load content.</p>';
                console.error('Error loading content:', error);
            });
    }

     //function to display user's Name    
     function displayUserName(){
        if (token) {
            const user = parseJwt(token);
        if (user && user.fullname){
            userNameElement.textContent = `Hi ${user.fullname}, Welcome to SCMXPertLite`;
        }else{
            userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite';
        }
        }else{
            userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite'
            //window.location.href = 'http://localhost:8080/Pages/Login.html';
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

    //Function to get cookie by name
    function getCookie(name){
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    document.getElementById('logout').addEventListener('click', () => {
        // Clear the JWT cookie
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to login page
        window.location.href = 'http://localhost:8080/Pages/Login.html';
    });

    // Load default content
    loadContent('dashboard.html');
    displayUserName();
});