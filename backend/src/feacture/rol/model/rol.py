from sqlalchemy import Column, Integer, String
from src.config.db import Base

class Rol(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), unique=True, nullable=False)  # 'egresado', 'admin'
