document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const contentBody = document.getElementById('content-body');
    

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

    // Load default content
    loadContent('/dashboard');
});