document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('alumno-form');
    const tableContainer = document.getElementById('table-container');
    const alumnoTableBody = document.getElementById('alumnos-table').querySelector('tbody');

    const alumnos = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const dni = document.getElementById('dni').value;
        const apellido = document.getElementById('apellido').value;
        const nombre = document.getElementById('nombre').value;
        const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;

        const edad = calcularEdad(fechaNacimiento);

        if (edad < 18) {
            alert('El alumno debe ser mayor de 18 años.');
            return;
        }

        if (alumnos.some(alumno => alumno.dni === dni)) {
            alert('El DNI ya está registrado.');
            return;
        }

        const alumno = {
            dni,
            apellido,
            nombre,
            fechaNacimiento,
            edad,
            email,
            telefono
        };
        
        alumnos.push(alumno);

        tableContainer.style.display = 'block';

        mostrarAlumnos();
    });


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


    function mostrarAlumnos() {
        alumnos.sort((a, b) => a.apellido.localeCompare(b.apellido));

        alumnoTableBody.innerHTML = '';

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
