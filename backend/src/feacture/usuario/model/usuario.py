from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.config.db import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    estado = Column(String(20), default="activo")  # activo, suspendido
    rol = relationship("Rol")
