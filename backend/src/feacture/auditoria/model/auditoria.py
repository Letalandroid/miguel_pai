from sqlalchemy import Column, Integer, String, DateTime, Text
from src.config.db import Base
from datetime import datetime

class Auditoria(Base):
    __tablename__ = "auditoria"
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)
    accion = Column(String(100), nullable=False)
    detalle = Column(Text, nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow)
