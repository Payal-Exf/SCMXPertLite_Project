document.addEventListener('DOMContentLoaded', function(){

    const fields = [
        'shipment_No', 'container_No', 'route_details', 'goods_type',
        'Device', 'Exp_delivery_date', 'PO_No', 'Delivery_no',
        'NDC_no', 'Batch_ID', 'Serial_no', 'Shipment_descr'
    ];
    const expDeliveryDateInput = document.getElementById('Exp_delivery_date');
    const expDeliveryDateError = document.getElementById('Exp_delivery_date_error');
    const clearButton = document.getElementById('clear-form');

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
        
        const currentDate = new Date();
        const expDeliveryDate = new Date(expDeliveryDateInput.value);
        if (expDeliveryDate < currentDate) {
            event.preventDefault(); // Prevent form submission
            isValid = false;
            expDeliveryDateError.textContent = 'Must be greater than or equal to the current date.';
        } else {
            expDeliveryDateError.textContent = ''; // Clear the error message
        }
    
    
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
            fetch('/create_shipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    //alert('Shipment created successfully');
                    Swal.fire({
                        title: 'Success!',
                        text: 'Shipment created successfully.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        customClass: {
                        popup: 'swal-popup',
                        title: 'swal-title',
                        content: 'swal-content',
                        confirmButton: 'swal-confirm-button'
                        }
                    })
                    // Clear form
                    
                    document.getElementById('shipment-form').reset();
                } else {
                    //alert('Error creating shipment');
                    Swal.fire({
                        title: 'Oops!',
                        text: 'Error creating shipment.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        customClass: {
                        popup: 'swal-popup',
                        title: 'swal-title',
                        content: 'swal-content',
                        confirmButton: 'swal-confirm-button'
                        }
                    })
                }
            })
            .catch(error => {
                console.error('Error:', error);
                //alert('An error occurred while creating the shipment');
                Swal.fire({
                    title: 'Oops!',
                    text: 'An error occurred while creating the shipment.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    customClass: {
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                    }
                })
            });
        }
    });
   
    expDeliveryDateInput.addEventListener('input', function () {
        expDeliveryDateError.textContent = '';
    });

    clearButton.addEventListener('click', () => {   
        document.getElementById('shipment-form').reset();
        clearErrors();
    });

    function clearErrors(){
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(function (element) {
            element.textContent = '';
        });
    }
})