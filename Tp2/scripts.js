document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('alumno-form');
    const tableContainer = document.getElementById('table-container');
    const alumnoTableBody = document.getElementById('alumnos-table').querySelector('tbody');

    const alumnos = [];

    // Manejar el evento de envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const dni = document.getElementById('dni').value;
        const apellido = document.getElementById('apellido').value;
        const nombre = document.getElementById('nombre').value;
        const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;

        // Calcular la edad del alumno
        const edad = calcularEdad(fechaNacimiento);

        // Validar que el alumno sea mayor de 18 años
        if (edad < 18) {
            alert('El alumno debe ser mayor de 18 años.');
            return;
        }

        // Validar que el DNI no esté repetido
        if (alumnos.some(alumno => alumno.dni === dni)) {
            alert('El DNI ya está registrado.');
            return;
        }

        // Crear el objeto alumno
        const alumno = {
            dni,
            apellido,
            nombre,
            fechaNacimiento,
            edad,
            email,
            telefono
        };

        // Agregar el alumno al array
        alumnos.push(alumno);

        // Mostrar la tabla
        tableContainer.style.display = 'block';

        // Esconder el formulario si has terminado de ingresar todos los alumnos
        form.reset();

        // Actualizar la tabla
        mostrarAlumnos();
    });

    // Función para calcular la edad
    function calcularEdad(fechaNacimiento) {
        const fechaNacimientoDate = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
        const mes = hoy.getMonth() - fechaNacimientoDate.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())) {
            edad--;
        }
        return edad;
    }

    // Función para mostrar los alumnos en la tabla
    function mostrarAlumnos() {
        // Ordenar alumnos por apellido
        alumnos.sort((a, b) => a.apellido.localeCompare(b.apellido));

        // Limpiar el cuerpo de la tabla
        alumnoTableBody.innerHTML = '';

        // Agregar cada alumno como una nueva fila
        alumnos.forEach(alumno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${alumno.dni}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.fechaNacimiento}</td>
                <td>${alumno.edad}</td>
                <td>${alumno.email}</td>
                <td>${alumno.telefono}</td>
            `;
            alumnoTableBody.appendChild(tr);
        });
    }
});
