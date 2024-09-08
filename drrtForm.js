document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitButton");
    const deleteButton = document.getElementById("deleteButton");
    const updateButton = document.getElementById("updateButton");
    const printButton = document.getElementById("printButton");
    const logOutButton = document.getElementById("logOut");
    
    const form = document.getElementById("form");

    // Event listener for the submit button
    submitButton.addEventListener("click", submit);
    deleteButton.addEventListener("click", deletes);
    updateButton.addEventListener("click", update);
    printButton.addEventListener("click", print);
    logOutButton.addEventListener("click", logOut);
    

    // Function to handle "Enter" key press for form submission
    function keyPressEnter(event) {
        if (event.key === "Enter") {
            submit(event);
        }
    }

    // Update the time every second and display it in the "time" element


    function date() {
        const nowDate = new Date();
        document.getElementById("date").textContent = nowDate.toLocaleDateString();
    }
    function updateTime() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('time').textContent = now.toLocaleTimeString([], options);
    }

    setInterval(updateTime, 1000);
    updateTime();
    date();

    // Array of input elements to add "Enter" key event listener for submission
    const elements = [
        document.getElementById("name"),
        document.getElementById("middleName"),
        document.getElementById("surName"),
        document.getElementById("age"),
        document.getElementById("birthDate"),
        document.getElementById("contactNumber"),
        document.getElementById("address"),
        document.getElementById("email"),
        document.getElementById("gender")
    ];

    elements.forEach(element => {
        if (element) {
            element.addEventListener("keydown", keyPressEnter);
        }
    });

    // Submit function to validate form and send data to the server
    function submit(event) {
        event.preventDefault();

        // Form validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form values
        const values = {
            name: document.getElementById("name").value.trim(),
            middlename: document.getElementById("middleName").value.trim(),
            surname: document.getElementById("surName").value.trim(),
            age: document.getElementById("age").value.trim(),
            birthdate: document.getElementById("birthDate").value.trim(),
            contactnumber: document.getElementById("contactNumber").value.trim(),
            address: document.getElementById("address").value.trim(),
            email: document.getElementById("email").value.trim(),
            gender: document.getElementById("gender").value.trim()
        };

        // Validation logic
        if (values.name[0] !== values.name[0].toUpperCase()) {
            window.alert("Name: first letter should be capitalized");
            document.getElementById("name").value = "";
            return;
        }

        if (values.middlename[0] !== values.middlename[0].toUpperCase()) {
            window.alert("Middlename: first letter should be capitalized");
            document.getElementById("middleName").value = "";
            return;
        }

        if (values.surname[0] !== values.surname[0].toUpperCase()) {
            window.alert("Surname: first letter should be capitalized");
            document.getElementById("surName").value = "";
            return;
        }

        if (values.address[0] !== values.address[0].toUpperCase()) {
            window.alert("Address: first letter should be capitalized");
            document.getElementById("address").value = "";
            return;
        }

        if (values.contactnumber.length !== 11) {
            window.alert("Contact number: length should be 11");
            document.getElementById("contactNumber").value = "";
            return;
        }


        if (isNaN(values.age) || values.age <= 15) {
            window.alert("Age is not valid");
            document.getElementById("age").value = "";
            return;
        }

        // Age and birth date validation
        const birthDate = new Date(values.birthdate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        if (values.age != calculatedAge) {
            window.alert("Invalid age and birth date");
            document.getElementById("birthDate").value = "";
            document.getElementById("age").value = "";
            return;
        }

        if (values.gender !== "Male" && values.gender !== "Female" || values.gender[0] !== values.gender[0].toUpperCase()) {
            window.alert("Gender must be 'Male' or 'Female' with first letter capitalized");
            document.getElementById("gender").value = "";
            return;
        }

        // Send data to server
        fetch('http://localhost:3000/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert("Submit successfully");
                // Reset form after submission
                document.getElementById("name").value = "";
                document.getElementById("middleName").value = "";
                document.getElementById("surName").value = "";
                document.getElementById("age").value = "";
                document.getElementById("birthDate").value = "";
                document.getElementById("contactNumber").value = "";
                document.getElementById("address").value = "";
                document.getElementById("email").value = "";
                document.getElementById("gender").value = "";

                // Fetch data after form submission
                getTheData();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Function to fetch and display data

    function getTheData() {
        fetch('http://localhost:3000/data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);

                const tableBody = document.getElementById("table-body");
                tableBody.innerHTML = '';

                // Populate table with data
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.className = 'my-row';

                    row.innerHTML = `
                        <td id="dataId" class="data doubleClick">${item.id}</td>
                        <td id="dataName" class="data">${item.name}</td>
                        <td id="middleName" class="data">${item.middlename}</td>
                        <td id="surName" class="data">${item.surname}</td>
                        <td id="age" class="data">${item.age}</td>
                        <td id="dataBirthData class="data">${item.birthdate}</td>
                        <td id="dataAddress class="data">${item.address}</td>
                        <td id="dataContactNumber" class="data">${item.contactnumber}</td>
                        <td id="gender" class="data">${item.gender}</td>
                        <td id="data" class="data">${item.email}</td>
                    `;

                    tableBody.appendChild(row);
                });
            
                // Add double-click event listeners to the table cells for selecting data
                document.querySelectorAll("td.doubleClick").forEach(cell => {
                    cell.addEventListener("dblclick", () => {
                        const clickedId = cell.textContent.trim();
                        const selectedData = data.find(item => item.id.toString() === clickedId);

                        if (selectedData) {
                            document.getElementById("name").value = selectedData.name;
                            document.getElementById("middleName").value = selectedData.middlename;
                            document.getElementById("surName").value = selectedData.surname;
                            document.getElementById("age").value = selectedData.age;

                            const birthDateFormatted = new Date(selectedData.birthdate).toISOString().split('T')[0];
                            document.getElementById("birthDate").value = birthDateFormatted;
                            document.getElementById("address").value = selectedData.address;
                            document.getElementById("contactNumber").value = selectedData.contactnumber;
                            document.getElementById("gender").value = selectedData.gender;
                            document.getElementById("email").value = selectedData.email;

                            

                         
                        }
                    });
                });
               
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Can't fetch the data!");
            });
    }

    getTheData();

 //deletes the data
    function deletes() {
        const idValue = document.getElementById("dataId").textContent;

        if (!idValue) {
            alert("Please enter an ID to delete");
            return;
        }

        fetch('http://localhost:3000/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idValue })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert("Delete successfully");
                getTheData();  // Refresh the table data after deletione
                elements.forEach(element => {
                    element.value = "";
                })
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Failed to delete the item!");
            });
    }

    // update the data in front end

    function update() {
        const id = document.getElementById("dataId").textContent.trim();
        const values = {
            id: id,
            name: document.getElementById("name").value.trim(),
            middlename: document.getElementById("middleName").value.trim(),
            surname: document.getElementById("surName").value.trim(),
            age: document.getElementById("age").value.trim(),
            birthdate: document.getElementById("birthDate").value.trim(),
            contactnumber: document.getElementById("contactNumber").value.trim(),
            address: document.getElementById("address").value.trim(),
            email: document.getElementById("email").value.trim(),
            gender: document.getElementById("gender").value.trim()
        };

        // Ensure all required fields are filled
        if (!id) {
            alert("Please select an ID to update");
            return;
        }

        fetch('http://localhost:3000/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Network response was not ok');
                    });
                }
                return response.json();
            })  
            .then(data => {
                alert("Update successfully");
                getTheData();  
                elements.forEach(element => {
                    element.value = "";
                })
        
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Failed to update the item!");
            });
    }

    function print() {
        window.print();


    }

    function logOut() {
        sessionStorage
        localStorage
        window.location.href = 'index.html';
    }

});
