document.addEventListener('DOMContentLoaded', () => {
    const deviceSearch = document.getElementById('Search_Device');
    const dropdown = document.getElementById('dropdown');
    const searchButton = document.getElementById('searchButton');
    const deviceDetails = document.getElementById('deviceDetails');

    // Fetch device IDs and populate dropdown
    fetch('http://localhost:8000/getDeviceIds')  
        .then(response => response.json())
        .then(data => {
            if(Array.isArray(data)){
                data.forEach(device => {
                    
                    const div = document.createElement('div');
                    div.classList.add('dropdown-item');
                    div.textContent = device;
                    div.addEventListener('click',() => {
                        deviceSearch.value = device;
                        dropdown.classList.remove('show');
                    });
                    dropdown.appendChild(div)
                });
            }else{
                console.error('API response is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching device IDs:', error));

    // Show dropdown on search input click
    deviceSearch.addEventListener('click', () => {
        dropdown.classList.add('show');
    });

    // Hide dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-box')) {
            dropdown.classList.remove('show');
        }
    });

    // Fetch and display device details based on search button click
    searchButton.addEventListener('click', () => {
        const fields = ['Search_Device'];
        var deviceId = deviceSearch.value;
        //deviceSearch.textContent = deviceDropdown.value;
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
                    if(Array.isArray(data)){
                        displayDeviceDetails(data);
                    }else{
                        console.error('API response is not an array:', data);
                        deviceDetails.innerHTML = '<p>No data available</p>';
                    }
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
});

 