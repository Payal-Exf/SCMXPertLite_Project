document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

async function initPage() {
    const shipmentDetails = document.getElementById('shipmentDetails');
    const adminControls = document.getElementById('adminControls');
    const shipmentFilter = document.getElementById('shipmentFilter');

    try {
        const userDetails = await displayUserDetails();
        console.log(userDetails);

        const response = await fetch('/my_Shipments', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
            console.log(data.length);
            if (userDetails.role === "Admin") {
                console.log("I'm an Admin");
                adminControls.style.display = 'block';
                shipmentFilter.addEventListener('change', () => {
                    const shipmentFiltervalue = document.getElementById('shipmentFilter').value;
                    console.log(shipmentFiltervalue);
                    displayMyShipments(data, shipmentFiltervalue, userDetails.email);
                });
            }
            displayMyShipments(data, 'myShipments', userDetails.email);
        } else {
            console.error('API response is not an array', data);
            shipmentDetails.innerHTML = '<p>No data available</p>';
        }
    } catch (error) {
        console.error('Failed to fetch user shipments:', error);
        Swal.fire({
            title: 'Oops!',
            text: 'Failed to fetch user shipments.' || error,
            icon: 'error',
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                content: 'swal-content',
                confirmButton: 'swal-confirm-button'
            }
        });
    }
}

async function displayUserDetails() {
    try {
        const response = await fetch('/current_user', {
            method: 'GET',
            credentials: 'include' // Include cookies in the request
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
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
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
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
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    }
}

function displayMyShipments(data, filter, userEmail) {
    let filteredData;
    if (filter === 'allShipments') {
        filteredData = data;
    } else {
        filteredData = data.filter(record => record.Created_by === userEmail);
    }
    if (filteredData.length > 0) {
        shipmentDetails.innerHTML = `
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Shipment No.</th>
                        <th>Container No.</th>
                        <th>Route Details</th>
                        <th>Goods Type</th>
                        <th>Device</th>
                        <th>Exp. Delivery</th>
                        <th>PO No.</th>
                        <th>Delivery No.</th>
                        <th>NDC No.</th>
                        <th>Batch ID</th>
                        <th>Serial No.</th>
                        <th>Shipment details</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredData.map(record => `
                        <tr>
                            <td>${record.shipment_No}</td>
                            <td>${record.container_No}</td>
                            <td>${record.route_details}</td>
                            <td>${record.goods_type}</td>
                            <td>${record.Device}</td>
                            <td>${record.Exp_delivery_date}</td>
                            <td>${record.PO_No}</td>
                            <td>${record.Delivery_no}</td>
                            <td>${record.NDC_no}</td>
                            <td>${record.Batch_ID}</td>
                            <td>${record.Serial_no}</td>
                            <td>${record.Shipment_descr}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        shipmentDetails.innerHTML = `<h4 style="display: inherit !important;">No Shipment Data Available.</h4>`;
    }
}
