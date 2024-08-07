document.addEventListener('DOMContentLoaded', () => {
    const deviceSearch = document.getElementById('Search_Device');
    const dropdown = document.getElementById('dropdown');
    const searchButton = document.getElementById('searchButton');
    const deviceDetails = document.getElementById('deviceDetails');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    let currentPage = 1;
    const rowsPerPage = 20;
    let deviceData = [];

    // Fetch device IDs and populate dropdown
    fetch('/getDeviceIds')  
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
        var deviceId = deviceSearch.value;
        
        if (!deviceId.trim()){
            fetch('/Device_Details')
            .then(response => response.json())
            .then(data => {
                if(Array.isArray(data)){
                    deviceData = data;
                    displayDeviceDetails();
                    setupPagination();
                }else{
                    console.error('API response is not an array:', data);
                    deviceDetails.innerHTML = '<p>No data available</p>';
                }
            })
        }
        else{
            fetch(`/Device_Details/${deviceId}`)  
                .then(response => response.json())
                .then(data => {
                    if(Array.isArray(data) && (data.length)> 0){
                        deviceData = data;
                        displayDeviceDetails();
                        setupPagination();
                    }else{
                        console.error('API response is not an array or is not of finite length:', data);
                        Swal.fire({
                            title: 'Oops!',
                            text: 'No Data Available!',
                            icon: 'warning',
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
                    console.error('Error fetching device details:', error)
                    Swal.fire({
                        title: 'Oops!',
                        text: 'Error fetching device details!',
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

    function displayDeviceDetails() {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = deviceData.slice(start, end);

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
                    ${paginatedData.map(record => `
                        <tr>
                            <td>${record.Device_Id}</td>
                            <td>${record.Battery_Level}</td>
                            <td>${record.First_Sensor_temperature} &deg Celsius</td>
                            <td>${record.Route_From}</td>
                            <td>${record.Route_To}</td>
                            <td>${record.Timestamp}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        setupPagination();
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayDeviceDetails();
            updatePageInfo();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(deviceData.length / rowsPerPage)) {
            currentPage++;
            displayDeviceDetails();
            updatePageInfo();
        }
    });

    function setupPagination() { 
        const pageCount = Math.ceil(deviceData.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
        updatePageInfo();
        
    }

    function updatePageInfo() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(deviceData.length / rowsPerPage);
    }
});



 