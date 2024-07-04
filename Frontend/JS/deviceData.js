document.addEventListener('DOMContentLoaded', () => {
    const deviceSearch = document.getElementById('Search_Device');
    const dropdown = document.getElementById('dropdown');
    const searchButton = document.getElementById('searchButton');
    const deviceDetails = document.getElementById('deviceDetails');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;
    const rowsPerPage = 20;
    let deviceData = [];

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
        var deviceId = deviceSearch.value;
        
        if (!deviceId.trim()){
            fetch('http://localhost:8000/Device_Details/')
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
            fetch(`http://localhost:8000/Device_Details/${deviceId}`)  
                .then(response => response.json())
                .then(data => {
                    if(Array.isArray(data) && (data.length)> 0){
                        deviceData = data;
                        displayDeviceDetails();
                        setupPagination();
                    }else{
                        console.error('API response is not an array or is not of finite length:', data);
                        deviceDetails.innerHTML = `<p style="color: red; font-weight: 600;">${data}</p>`;
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
    }

    function setupPagination() { 
        //Total No. Pages
        const pageCount = Math.ceil(deviceData.length/ rowsPerPage);
        pagination.innerHTML = '';

        for (let i =1; i<= pageCount; i++){
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.classList.add('pagination-btn');
            btn.addEventListener('click', () => {
                currentPage = i;
                displayDeviceDetails();
                updatePaginationButtons();
            });
            pagination.appendChild(btn);
        }

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const buttons = document.querySelectorAll('.pagination-btn');
        buttons.forEach((btn, index) => {
            if (index + 1 === currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
});



 