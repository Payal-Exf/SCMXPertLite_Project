document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const highlightMenu = document.querySelectorAll('.sidebar-menu li a');

    //Toggle sidebar collapse
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });

    // Highlight active menu item
    highlightMenu.forEach(item => {
        item.addEventListener('click', () => {
            highlightMenu.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Set active class based on current URL
    const currentUrl = window.location.pathname.split('/').pop();
    highlightMenu.forEach(item => {
        if (item.getAttribute('href') === currentUrl) {
            item.classList.add('active');
        }
    });
});
