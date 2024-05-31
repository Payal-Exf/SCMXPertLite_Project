document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentBody = document.getElementById('content-body');
    const userNameElement = document.getElementById('username');
    // const sidebar = document.getElementById('sidebar');
    // const content = document.getElementById('content');
    // const sidebarToggle = document.getElementById('sidebarToggle');
    // const highlightMenu = document.querySelectorAll('.sidebar-menu li a');

    const token = getCookie('access_token');

    // //Toggle sidebar collapse
    // sidebarToggle.addEventListener('click', () => {
    //     sidebar.classList.toggle('collapsed');
    //     content.classList.toggle('collapsed');
    // });

    // // Highlight active menu item
    // highlightMenu.forEach(item => {
    //     item.addEventListener('click', () => {
    //         highlightMenu.forEach(i => i.classList.remove('active'));
    //         item.classList.add('active');
    //     });
    // });

    // // Set active class based on current URL
    // const currentUrl = window.location.pathname.split('/').pop();
    // highlightMenu.forEach(item => {
    //     if (item.getAttribute('href') === currentUrl) {
    //         item.classList.add('active');
    //     }
    // });

    //load the content 
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
                executeScripts(contentBody);
            })
            .catch(error => {
                contentBody.innerHTML = '<h2>Error</h2><p>Unable to load content.</p>';
                console.error('Error loading content:', error);
            });
    }

    //function to load scripts  related to each content 
    function executeScripts(element) {
        const scripts = Array.from(element.getElementsByTagName('script'));
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.head.appendChild(newScript).parentNode.removeChild(newScript);
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
            //window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
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
        window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
    });

    // Load default content
    loadContent('dashboard.html');
    displayUserName();
});