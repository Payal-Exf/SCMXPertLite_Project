const fields = [
    'shipment_No', 'container_No', 'route_details', 'goods_type',
    'Device', 'Exp_delivery_date', 'PO_No', 'Delivery_no',
    'NDC_no', 'Batch_ID', 'Serial_no', 'Shipment_descr'
];

document.getElementById('shipment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => element.textContent = '');

    // Validate fields
    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(`${field}_error`);
        if (!input.value.trim()) {
            isValid = false;
            errorElement.textContent = `${field.replace(/_/g, ' ')} is required`;
        }
    });

    if (isValid) {
        // Gather form data
        const formData = {
            shipment_No: document.getElementById('shipment_No').value,
            container_No: document.getElementById('container_No').value,
            route_details: document.getElementById('route_details').value,
            goods_type: document.getElementById('goods_type').value,
            Device: document.getElementById('Device').value,
            Exp_delivery_date: document.getElementById('Exp_delivery_date').value,
            PO_No: document.getElementById('PO_No').value,
            Delivery_no: document.getElementById('Delivery_no').value,
            NDC_no: document.getElementById('NDC_no').value,
            Batch_ID: document.getElementById('Batch_ID').value,
            Serial_no: document.getElementById('Serial_no').value,
            Shipment_descr: document.getElementById('Shipment_descr').value,
        };

        // Send form data to the backend
        fetch('http://127.0.0.1:8000/create_shipment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Shipment created successfully');
                // Clear form
                document.getElementById('shipment-form').reset();
            } else {
                alert('Error creating shipment');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the shipment');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
const userNameElement = document.getElementById('username');
const token = getCookie('access_token');
     //function to display user's Name    
     function displayUserName(){
        if (token) 
        {
            const payload = parseJwt(token);
            console.log("fullname " + payload.fullname)
            if (payload.fullname){
                userNameElement.textContent = `Hi ${payload.fullname}, Welcome to SCMXPertLite`;
            }else{
                userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite';
            }
        }else{
            alert("Token Expired, Please Relogin.")
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

    document.getElementById('clear-form').addEventListener('click', ()=> {
        //reset the form when clear form button is clicked
        form = document.getElementById('shipment-form');
        form.reset();
        fields.forEach(field => {
            const input = document.getElementById(field);
            const errorElement = document.getElementById(`${field}_error`);
            errorElement.textContent = '';
        });
    });

    document.getElementById('logout').addEventListener('click', () => {
        // Clear the JWT Cookie
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to login page
        window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
    });

    displayUserName();
});
