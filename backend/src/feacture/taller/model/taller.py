from sqlalchemy import Column, Integer, String, Date, Time, Text
from src.config.db import Base

class Taller(Base):
    __tablename__ = "talleres"
    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    enlace = Column(String(255), nullable=False)
    flyer = Column(String(255), nullable=True)  # Ruta o nombre del archivo
    accesos = Column(Integer, default=0)
