const BASE_URL_API = 'https://utn-lubnan-api-1.herokuapp.com/api';

const getCompanies = async () => {
    const promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', `${BASE_URL_API}/Company`);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Opps! Request failed', request.error));
            }
        };
        request.send();
    });
    return promise;
};

const getEmployees = async () => {
    const promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', `${BASE_URL_API}/Employee`);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Opps! Request Failed', request.error));
            }
        };
        request.send();
    });
    return promise;
};

const addEmploye = async (newEmployee) => {
    const promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', `${BASE_URL_API}/Employee`);
        request.responseType = 'json';
        request.setRequestHeader('Content-Type', 'application/json'); 
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Opps! Request failed', request.error));
            }
        };
        request.send(JSON.stringify(newEmployee));
    });
    return promise;
};

const deleteEmployee = async (employeeId) => {
    const promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('DELETE', `${BASE_URL_API}/Employee/${employeeId}`); 
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Opps! Request failed', request.error));
            }
        };
        request.send();
    });
    return promise;
};

const matchEmployeeAndCompany = async () => {
    try {
        const employees = await getEmployees();
        const companies = await getCompanies();

        companies.forEach((company) => {
            employees.forEach((employee) => {
                if (employee.companyId === company.companyId) {
                    employee.CompanyName = company.name;
                }
            });
        });
        renderEmployees(employees);
    } catch (error) {
        console.error('Error fetching or processing data: ', error);
    }
};

const renderEmployees = (employees) => {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar filas

    employees.forEach(employee => {
        const row = document.createElement('tr');

        // Crear las celdas con la informacion del empleado
        const idCell = document.createElement('td');
        idCell.textContent = employee.employeeId;

        const firstNameCell = document.createElement('td');
        firstNameCell.textContent = employee.firstName;

        const lastNameCell = document.createElement('td');
        lastNameCell.textContent = employee.lastName;

        const emailCell = document.createElement('td');
        emailCell.textContent = employee.email;

        const companyCell = document.createElement('td');
        companyCell.textContent = employee.CompanyName || 'Sin Compañía';

        // Crear la celda con el botón eliminar
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', async () => { 
            await eliminarEmpleado(employee.employeeId);
        });
        actionsCell.appendChild(deleteButton);

        // Agregar las celdas a la fila
        row.appendChild(idCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(emailCell);
        row.appendChild(companyCell);
        row.appendChild(actionsCell);

        // Agregar la fila a la tabla
        tableBody.appendChild(row);
    });
};

const agregarEmpleado = async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const companyId = parseInt(document.getElementById('companyId').value, 10);

    const newEmployee = { firstName, lastName, email, companyId };

    try {
        await addEmploye(newEmployee);
        matchEmployeeAndCompany();
        alert('Empleado cargado con éxito');
    } catch (error) {
        console.error('Error al cargar el empleado: ', error);
    }
};

const eliminarEmpleado = async (employeeId) => {
    try {
        await deleteEmployee(employeeId);
        matchEmployeeAndCompany(); // Llama a esta función para actualizar la tabla después de eliminar
        alert('Empleado eliminado');
    } catch (error) {
        console.error('Error al borrar empleado', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    matchEmployeeAndCompany();

    const addEmployeeForm = document.getElementById('addEmployeeForm');
    addEmployeeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue
        agregarEmpleado();
    });
});
