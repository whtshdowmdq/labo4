// Función get personalizada usando XMLHttpRequest
function get(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                callback(null, response);
            } else {
                callback('Error: ' + xhr.statusText, null);
            }
        }
    };
    xhr.send();
}

// Función para listar empleados con sus respectivas compañías
function listEmployeesWithCompany() {
    get('https://utn-lubnan-api-1.herokuapp.com/api/Employee', function(error, employees) {
        if (error) {
            console.error('Error al obtener empleados:', error);
        } else {
            get('https://utn-lubnan-api-1.herokuapp.com/api/Company', function(error, companies) {
                if (error) {
                    console.error('Error al obtener compañías:', error);
                } else {
                    const combined = [];

                    // Combinando empleados con compañías
                    for (let i = 0; i < employees.length; i++) {
                        const employee = employees[i];
                        let companyName = 'Unknown';

                        // Buscar la compañía correspondiente
                        for (let j = 0; j < companies.length; j++) {
                            const company = companies[j];
                            if (employee.companyId === company.companyId) {
                                companyName = company.name;
                                break;
                            }
                        }

                        combined.push({
                            firstName: employee.firstName,
                            lastName: employee.lastName,
                            companyName: companyName
                        });
                    }

                    // Mostrar la lista en la tabla
                    const tableBody = document.getElementById('employeeTableBody');
                    tableBody.innerHTML = ''; // Limpiar la tabla
                    combined.forEach(function(emp) {
                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${emp.firstName}</td><td>${emp.lastName}</td><td>${emp.companyName}</td>`;
                        tableBody.appendChild(row);
                    });
                }
            });
        }
    });
}

// Función para agregar un empleado usando POST
function addEmployee() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const companyId = document.getElementById('companyId').value;

    const newEmployee = {
        firstName: firstName,
        lastName: lastName,
        companyId: parseInt(companyId)
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://utn-lubnan-api-1.herokuapp.com/api/Employee', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const messageElement = document.getElementById('message');
            if (xhr.status === 201) {
                messageElement.textContent = 'Empleado agregado correctamente';
                messageElement.style.color = 'green';
            } else {
                messageElement.textContent = 'Error al agregar empleado: ' + xhr.statusText;
                messageElement.style.color = 'red';
            }
        }
    };
    xhr.send(JSON.stringify(newEmployee));
}

// Función para eliminar un empleado usando DELETE
function deleteEmployeeById() {
    const employeeId = document.getElementById('employeeIdToDelete').value;

    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `https://utn-lubnan-api-1.herokuapp.com/api/Employee/${employeeId}`, true);
    xhr.onreadystatechange = function() {
        const messageElement = document.getElementById('message');
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                messageElement.textContent = 'Empleado eliminado correctamente';
                messageElement.style.color = 'green';
            } else {
                messageElement.textContent = 'Error al eliminar empleado: ' + xhr.statusText;
                messageElement.style.color = 'red';
            }
        }
    };
    xhr.send();
}
