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

        const token = getCookie('access_token');

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

        // Send form data to the backend
        fetch('http://127.0.0.1:8000/create_shipment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

