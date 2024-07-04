document.addEventListener('DOMContentLoaded', () => {
    const shipmentDetails = document.getElementById('shipmentDetails');
    const adminControls = document.getElementById('adminControls');
    const shipmentFilter = document.getElementById('shipmentFilter');
    const token = getCookie('access_token');
    const userDetails = displayUserDetails() //using funtion from user.js for frtching user details like email, role

    try{
        fetch('http://127.0.0.1:8000/my_Shipments', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },  
        }).then(response => response.json())
        .then(data => {
            if(Array.isArray(data)){
                console.log(data.length)
                if (userDetails["role"] === "Admin"){
                    console.log("I'm an Admin");
                    adminControls.style.display = 'block';
                    shipmentFilter.addEventListener('change', () => {
                        const shipmentFiltervalue = document.getElementById('shipmentFilter').value;
                        console.log(shipmentFiltervalue);
                        displayMyShipments(data, shipmentFiltervalue);
                    });
                }
                displayMyShipments(data, 'myShipments');
            }else{
                console.error('API response is not an array', data);
                shipmentDetails.innerHTML = '<p>No data available</p>';
            }
        })
        .catch(error => {
            console.error('Failed to fetch user shipments:', error)
            Swal.fire({
                title: 'Oops!',
                text: ('Failed to fetch user shipments.'|| error),
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
    catch (error){
        console.error('Error fetching shipment details:', error);
        Swal.fire({
            title: 'Oops!',
            text: ('Error fetching shipment details.'|| error),
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

    function displayMyShipments (data, filter) {
        let filteredData;
        const userEmail = userDetails["email"]
        if (filter === 'allShipments'){
            filteredData = data;
        }
        else{
            filteredData = data.filter(record => record.Created_by === userEmail);
        }
        if (filteredData.length > 0){
            shipmentDetails.innerHTML = `
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>shipment No.</th>
                            <th>container No.</th>
                            <th>Route Details</th>
                            <th>Goods Type</th>
                            <th>Device</th>
                            <th>Exp. Delivery</th>
                            <th>PO No.</th>
                            <th>Delivery No.</th>
                            <th>NDC No.</th>
                            <th>Batch ID</th>
                            <th>Serial No.o</th>
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
        }
        else{
            shipmentDetails.innerHTML = `<h4 style="display: inherit !important;">No Shipment Data Available.</h4>`;
        }
    }

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

    //to fetch UserDetails
    function displayUserDetails(){
        if (token) {
            const payload = parseJwt(token);
            console.log("fullname: " + payload.fullname + "," + 
            "role: " + payload.role + "," + 
            "email: " +  payload.sub)
            if (payload.fullname){
                return {"fullname": payload.fullname, "role": payload.role, "email": payload.sub}
            }else{

                // alert("Token Expired, Please Relogin.")

                Swal.fire({
                    title: 'Token Expired!!',
                    text: 'Please Relogin.',
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
                        window.location.href='./Login.html'
                    }
                })
            }
        }else{
            // alert("Unauthorized Access, Please Login.")
            Swal.fire({
                title: 'Unauthorized Access!!',
                text: 'Please Login.',
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
                    window.location.href='./Login.html'
                }
            })
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
});
 