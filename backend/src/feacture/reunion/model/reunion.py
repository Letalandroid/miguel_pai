from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.config.db import Base

class Reunion(Base):
    __tablename__ = "reuniones"
    id = Column(Integer, primary_key=True, autoincrement=True)
    egresado_id = Column(String(20), ForeignKey("egresados.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    estado = Column(String(20), default="pendiente")  # pendiente, confirmada, cancelada, realizada
    observaciones = Column(Text, nullable=True)
    egresado = relationship("Egresado", backref="reuniones")
