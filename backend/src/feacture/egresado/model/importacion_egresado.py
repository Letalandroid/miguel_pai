from sqlalchemy import Column, Integer, String, DateTime, Text
from src.config.db import Base
from datetime import datetime

class ImportacionEgresado(Base):
    __tablename__ = "importaciones_egresado"
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    total_registros = Column(Integer, nullable=False)
    exitosos = Column(Integer, nullable=False)
    rechazados = Column(Integer, nullable=False)
    resultado = Column(String(50), nullable=False)  # 'exitoso', 'parcial', 'fallido'
    detalle = Column(Text, nullable=True)  # Resumen o errores
    archivo_rechazados = Column(String(255), nullable=True)  # Ruta o nombre del archivo generado
