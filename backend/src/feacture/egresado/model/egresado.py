from sqlalchemy import Column, String, Integer, Date, Text
from src.config.db import Base

# Modelo de datos para Egresado
# Autor: GitHub Copilot

class Egresado(Base):
    __tablename__ = "egresados"

    id = Column(String(20), primary_key=True, index=True)
    usuario_dni = Column(String(20), unique=True, index=True)
    nombres = Column(String(100))
    apellidos = Column(String(100))
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    carrera_profesional = Column(String(100))
    grado_academico = Column(String(100), nullable=True)
    anio_egreso = Column(Integer)
    cv = Column(Text, nullable=True)
    ciudad = Column(String(100), nullable=True)
    genero = Column(String(20), nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    email_alternativo = Column(String(255), nullable=True)
    telefono = Column(String(20), nullable=True)
