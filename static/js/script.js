document.addEventListener('DOMContentLoaded', function() {

    const inscripcionForm = document.getElementById('inscripcionForm');
    const horariosTableBody = document.getElementById('horariosBody');
    const responseMessage = document.getElementById('responseMessage');

    // Función para mostrar mensajes de respuesta
    function showMessage(message, success = true) {
        responseMessage.textContent = message;
        responseMessage.style.display = 'block';
        responseMessage.style.backgroundColor = success ? '#d1e7dd' : '#f8d7da'; // Verdes y rojos suaves
        setTimeout(() => { responseMessage.style.display = 'none'; }, 5000);
    }

    // Función para agregar una fila a la tabla de horarios
    function agregarFilaHorario(dia, hora, nombre, correo) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${dia}</td>
            <td>${hora}</td>
            <td>${nombre}</td>
            <td>${correo}</td>
        `;
        horariosTableBody.appendChild(fila);
    }

    // Función para obtener y mostrar los horarios agendados
    function obtenerHorariosAgendados() {
        fetch('/obtener_horarios')
            .then(response => response.json())
            .then(data => {
                horariosTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
                Object.keys(data).forEach(dia => {
                    Object.keys(data[dia]).forEach(hora => {
                        data[dia][hora].forEach(inscripcion => {
                            agregarFilaHorario(dia, hora, inscripcion.nombre, inscripcion.correo);
                        });
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener los horarios:', error);
                showMessage('Error al obtener los horarios', false);
            });
    }

    // Manejador de eventos para el formulario de inscripción
    inscripcionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(inscripcionForm);
        
        fetch('/inscribir', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.mensaje, data.exito);
            if (data.exito) {
                obtenerHorariosAgendados(); // Actualizar la lista de inscritos si la inscripción fue exitosa
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Error al realizar la inscripción', false);
        });
    });

    // Cargar y mostrar las inscripciones actuales al cargar la página
    obtenerHorariosAgendados();
});
