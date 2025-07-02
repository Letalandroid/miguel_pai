from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.config.db import Base

class FechasDisponibles(Base):
    __tablename__ = "fechas_disponibles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    descripcion = Column(String(255), nullable=True)
    estado = Column(String(20), default="disponible")  # disponible, no_disponible

## Eliminada la clase Reunion duplicada. Usar la definición de src/feacture/reunion/model/reunion.py

class HistorialEstado(Base):
    __tablename__ = "historial_estado"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reunion_id = Column(Integer, ForeignKey("reuniones.id"), nullable=False)
    estado = Column(String(20), nullable=False)
    fecha_cambio = Column(Date, nullable=False)
    observaciones = Column(Text, nullable=True)
    reunion = relationship("Reunion", backref="historial_estados")
