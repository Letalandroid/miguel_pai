from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from src.config.db import Base
from datetime import datetime

class Notificacion(Base):
    __tablename__ = "notificaciones"
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(String(20), nullable=False)  # Puede ser egresado o admin
    tipo_usuario = Column(String(20), nullable=False)  # 'egresado' o 'admin'
    titulo = Column(String(255), nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha_envio = Column(DateTime, default=datetime.utcnow)
    leida = Column(Integer, default=0)  # 0: no leída, 1: leída
    evento_relacionado = Column(String(50), nullable=True)  # reunion, taller, etc.
    referencia_id = Column(Integer, nullable=True)  # id de la reunión, taller, etc.
