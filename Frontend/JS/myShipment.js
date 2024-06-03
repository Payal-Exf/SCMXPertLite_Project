document.addEventListener('DOMContentLoaded', () => {
    const shipmentDetails = document.getElementById('shipmentDetails');
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

    try{
        const response = fetch('http://127.0.0.1:8000/my_Shipments', {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },  
        }).then(response => response.json())
        .then(data => {
            if(Array.isArray(data)){
                displayMyShipments(data);
            }else{
                console.error('API response is not an array:', data);
                shipmentDetails.innerHTML = '<p>No data available</p>';
            }
        })
        .catch(error => console.error('Error fetching device details:', error));
    }  
    catch (error){
        console.error('Error fetching shipment details:', error);
    }
    
    function displayMyShipments (data) {
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
                    ${data.map(record => `
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
});
 