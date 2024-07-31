document.addEventListener('DOMContentLoaded', async () => {
    const userNameElement = document.getElementById('username');
    // To display user name
    try {
        const response = await fetch('/current_user', {
            method: 'GET',
            credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
            const data = await response.json();
            const fullname = data.fullname || "Guest";
            const firstName = fullname.split(" ")[0].toLowerCase();
            const titleCaseFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
            userNameElement.textContent = `Hi ${titleCaseFirstName}, Welcome to SCM`;
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