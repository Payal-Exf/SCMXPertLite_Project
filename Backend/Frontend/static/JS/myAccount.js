document.addEventListener('DOMContentLoaded', async () => {
    const fullNameElement = document.getElementById('fullname');
    const emailElement = document.getElementById('email')
    const roleElement = document.getElementById('role')
    
    try {
        const response = await fetch('/current_user', {
            method: 'GET',
            credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
            const data = await response.json();
            fullNameElement.value = data.fullname.toString().toUpperCase();
            emailElement.value = data.email;
            roleElement.value = data.role.toString().toUpperCase();
        } else {
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
                    window.location.href='/login'
                }
            })
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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
                window.location.href='/login'
            }
        })
    }
});

function editProfile() {
    Swal.fire({
        title: 'Coming Soon!',
        text: 'This feature is coming soon. Stay tuned!',
        icon: 'info',
        confirmButtonText: 'Ok',
        customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        content: 'swal-content',
        confirmButton: 'swal-confirm-button'
        }
    });
}
