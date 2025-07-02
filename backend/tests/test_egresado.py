import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_registro_egresado():
    data = {
        "nombres": "Juan",
        "apellidos": "Pérez",
        "dni": "12345678",
        "email": "juan@correo.com",
        "password": "123456",
        "carrera_profesional": "Ingeniería",
        "anio_egreso": 2020,
        "genero": "Masculino",
        "fecha_nacimiento": "1995-01-01",
        "ciudad": "Lima"
    }
    response = client.post("/egresado/registro", json=data)
    assert response.status_code == 201
    assert response.json()["msg"] == "Egresado registrado exitosamente"

def test_login_egresado():
    data = {"email": "juan@correo.com", "password": "123456"}
    response = client.post("/egresado/login", json=data)
    assert response.status_code == 200
    assert response.json()["msg"] == "Autenticación exitosa"

def test_editar_perfil():
    data = {
        "nombres": "Juan Carlos",
        "apellidos": "Pérez",
        "dni": "12345678",
        "email": "juan@correo.com",
        "password": "123456",
        "carrera_profesional": "Ingeniería",
        "anio_egreso": 2020,
        "genero": "Masculino",
        "fecha_nacimiento": "1995-01-01",
        "ciudad": "Lima"
    }
    response = client.put("/egresado/perfil?dni=12345678", json=data)
    assert response.status_code == 200
    assert response.json()["msg"] == "Perfil actualizado"

def test_actualizar_contacto():
    data = {"email_alternativo": "juan.alt@correo.com", "telefono": "987654321"}
    response = client.put("/egresado/contacto?dni=12345678", json=data)
    assert response.status_code == 200
    assert response.json()["msg"] == "Contacto actualizado"

def test_filtrar_egresados():
    response = client.get("/egresado?carrera=Ingeniería&genero=Masculino&anio_egreso=2020&ciudad=Lima")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_recuperar_password():
    data = {"email": "juan@correo.com"}
    response = client.post("/egresado/recuperar-password", json=data)
    assert response.status_code == 200
    assert "correo de recuperación" in response.json()["msg"]
