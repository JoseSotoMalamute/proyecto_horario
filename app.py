from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Clase para representar una inscripción a una clase de CrossFit
class Inscripcion:
    def __init__(self, nombre, correo, dia):
        self.nombre = nombre
        self.correo = correo
        self.dia = dia  # Nuevo campo para el día de la semana

class Horario:
    def __init__(self):
        # Horarios predefinidos para las clases de CrossFit por día de la semana
        self.clases = {
            "lunes": {
                "19:00": [],
                "20:00": [],
                "21:00": []
            },
            "martes": {
                "18:00": [],
                "20:00": [],
                "21:00": []
            },
            "miercoles": {
                "19:00": [],
                "20:00": [],
                "21:00": []
            },
            "jueves": {
                "18:00": [],
                "20:00": [],
                "21:00": []
            },
            "viernes": {
                "19:00": [],
                "20:00": [],
            }
        }

    def inscribir(self, hora, inscripcion):
        dia = inscripcion.dia
        if any(participante.correo == inscripcion.correo for participante in self.clases[dia][hora]):
            return False, "Este correo ya está inscrito en este horario."
        self.clases[dia][hora].append(inscripcion)
        return True, f"{inscripcion.nombre} ha sido inscrito(a) para la clase del {dia} a las {hora}."

    def obtener_horarios(self):
        # Devuelve la lista de participantes por horario
        horarios = {dia: {hora: [{"nombre": inscripcion.nombre, "correo": inscripcion.correo}
                    for inscripcion in self.clases[dia][hora]]
                    for hora in self.clases[dia]}
                    for dia in self.clases}
        return horarios


# Instancia para manejar los horarios de CrossFit
horario_crossfit = Horario()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/inscribir', methods=['POST'])
def inscribir():
    nombre = request.form['nombre']
    correo = request.form['correo']
    hora = request.form['hora']
    dia = request.form['dia']  # Obtener el día desde el formulario
    inscripcion = Inscripcion(nombre, correo, dia)  # Pasar el día a la inscripción
    exito, mensaje = horario_crossfit.inscribir(hora, inscripcion)
    return jsonify({"exito": exito, "mensaje": mensaje})

@app.route('/obtener_horarios', methods=['GET'])
def obtener_horarios():
    return jsonify(horario_crossfit.obtener_horarios())

if __name__ == '__main__':
    app.run(debug=True)
