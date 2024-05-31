document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('username');
    const token = getCookie('access_token');
    const deviceSearch = document.getElementById('Search_Device');
    const deviceDropdown = document.getElementById('deviceDropdown');
    const searchButton = document.getElementById('searchButton');
    const deviceDetails = document.getElementById('deviceDetails');


    //function to display user's Name    
        function displayUserName(){
        if (token) {
            const payload = parseJwt(token);
            console.log("fullname " + payload.fullname)
        if (payload.fullname){
            userNameElement.textContent = `Hi ${payload.fullname}, Welcome to SCMXPertLite`;
        }else{
            userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite';
        }
        }else{
            userNameElement.textContent = 'Hi User, Welcome To SCMXPertLite'
            //window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
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

    document.getElementById('logout').addEventListener('click', () => {
        // Clear the JWT Cookie
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Redirect to login page
        window.location.href = 'http://127.0.0.1:8080/Pages/Login.html';
    });

    // Fetch device IDs and populate dropdown
    fetch('http://localhost:8000/getDeviceIds')  // Adjust the API endpoint as needed
        .then(response => response.json())
        .then(data => {
            data.forEach(device => {
                const option = document.createElement('option');
                option.value = device;
                option.textContent = device;
                deviceDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching device IDs:', error));

    // Fetch and display device details based on search button click
    searchButton.addEventListener('click', () => {
        const fields = ['Search_Device'];
        var deviceId = deviceDropdown.value;
        deviceSearch.textContent = deviceDropdown.value;
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

        if(isValid){
            fetch(`http://localhost:8000/Device_Details/${deviceId}`)  // Adjust the API endpoint as needed
                .then(response => response.json())
                .then(data => {
                    displayDeviceDetails(data);
                })
                .catch(error => console.error('Error fetching device details:', error));
        }
        else{

        }
    });

    function displayDeviceDetails(data) {
        deviceDetails.innerHTML = `
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Battery Level</th>
                        <th>First Sensor Temp</th>
                        <th>Route From</th>
                        <th>Route To</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(record => `
                        <tr>
                            <td>${record.Device_id}</td>
                            <td>${record.Battery_level}</td>
                            <td>${record.First_sensor_temp}</td>
                            <td>${record.Route_from}</td>
                            <td>${record.Route_to}</td>
                            <td>${record.Timestamp}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    displayUserName();
});

 