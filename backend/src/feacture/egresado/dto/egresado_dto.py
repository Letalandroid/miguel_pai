# DTO para registro y edición de egresado
# Autor: GitHub Copilot

import re
from datetime import date

class EgresadoRegistroDTO:
    def __init__(self, nombres, apellidos, dni, email, password, carrera_profesional, anio_egreso, genero, fecha_nacimiento, ciudad=None):
        if not re.match(r'^[0-9]{8,12}$', dni):
            raise ValueError("DNI inválido")
        if not re.match(r'^.+@.+\..+$', email):
            raise ValueError("Email inválido")
        if len(password) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")
        if genero and genero not in ["Masculino", "Femenino", "Otro"]:
            raise ValueError("Género inválido")
        if fecha_nacimiento and not isinstance(fecha_nacimiento, (str, date)):
            raise ValueError("Fecha de nacimiento inválida")
        self.nombres = nombres
        self.apellidos = apellidos
        self.dni = dni
        self.email = email
        self.password = password
        self.carrera_profesional = carrera_profesional
        self.anio_egreso = anio_egreso
        self.genero = genero
        self.fecha_nacimiento = fecha_nacimiento
        self.ciudad = ciudad
        self.email_alternativo = None
        self.telefono = None

class EgresadoContactoDTO:
    def __init__(self, email_alternativo, telefono):
        if email_alternativo and not re.match(r'^.+@.+\..+$', email_alternativo):
            raise ValueError("Email alternativo inválido")
        if telefono and not re.match(r'^[0-9]{7,20}$', telefono):
            raise ValueError("Teléfono inválido")
        self.email_alternativo = email_alternativo
        self.telefono = telefono
