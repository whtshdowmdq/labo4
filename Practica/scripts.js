const BASE_URL_API = 'https://utn-lubnan-api-1.herokuapp.com/api';

// Obtener compañías
const getCompanies = async () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `${BASE_URL_API}/Company`);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Problema al obtener las compañías'));
            }
        };
        request.send();
    });
};

// Obtener empleados
const getEmployees = async () => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', `${BASE_URL_API}/Employee`);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Problema al obtener los empleados'));
            }
        };
        request.send();
    });
};

// Agregar empleado
const addEmployee = async (newEmployee) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', `${BASE_URL_API}/Employee`);
        request.responseType = 'json';
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Problema al agregar el empleado'));
            }
        };
        request.send(JSON.stringify(newEmployee));
    });
};

// Eliminar empleado
const deleteEmployee = async (employeeId) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('DELETE', `${BASE_URL_API}/Employee/${employeeId}`);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error('Problema al eliminar el empleado'));
            }
        };
        request.send();
    });
};

const sortEmployeesByLastName =(employees)=>{
    return employees.sort((a,b)=>{
        const lastNameA = a.lastName.toLowerCase();
        const lastNameB = b.lastName.toLowerCase();
        if(lastNameA < lastNameB){
            return -1;
        }
        if(lastNameA > lastNameB){
            return 1;
        }
        return 0;
    });
}

// Asignar nombre de la compañía al empleado
const matchEmployeeWithCompany = async () => {
    try {
        const companies = await getCompanies();
        const employees = await getEmployees();

        for (let i = 0; i < companies.length; i++) {
            for (let j = 0; j < employees.length; j++) {
                if (employees[j].companyId === companies[i].companyId) {
                    employees[j].CompanyName = companies[i].name;
                }
            }
        }

        // Ordenar empleados por apellido
        const sortedEmployees = sortEmployeesByLastName(employees);
        renderEmployees(sortedEmployees); // Renderizar empleados ordenados
    } catch (error) {
        console.error('Error al cargar datos de empleados o compañías: ', error);
    }
};

// Renderizar empleados en la tabla
const renderEmployees = (employees) => {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    employees.forEach(employee => {
        const row = document.createElement('tr');

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

        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            eliminarEmpleado(employee.employeeId);
        });
        actionsCell.appendChild(deleteButton);

        row.appendChild(idCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(emailCell);
        row.appendChild(companyCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
};

// Agregar empleado al enviar el formulario
const agregarEmpleado = async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const companyId = parseInt(document.getElementById('companyId').value, 10);

    const newEmployee = { firstName, lastName, email, companyId };

    try {
        await addEmployee(newEmployee);
        matchEmployeeWithCompany(); // Recargar la tabla de empleados
    } catch (error) {
        console.error('Error al agregar empleado: ', error);
    }
};

// Eliminar empleado
const eliminarEmpleado = async (employeeId) => {
    try {
        await deleteEmployee(employeeId);
        matchEmployeeWithCompany(); // Recargar la tabla después de eliminar
    } catch (error) {
        console.error('Error al eliminar empleado: ', error);
    }
};

// Rellenar select de compañías
const populateCompanySelect = async () => {
    try {
        const companies = await getCompanies();
        const companySelect = document.getElementById('companyId');

        companySelect.innerHTML = ''; // Limpiar opciones previas

        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.companyId;
            option.textContent = company.name;
            companySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las compañías: ', error);
    }
};

// Evento DOMContentLoaded para inicializar
document.addEventListener('DOMContentLoaded', () => {
    matchEmployeeWithCompany();
    populateCompanySelect();

    const addEmployeeForm = document.getElementById('addEmployeeForm');
    addEmployeeForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario
        agregarEmpleado(); // Llamar a la función de agregar empleado
    });
});
