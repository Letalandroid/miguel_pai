from src.feacture.rol.model.rol import Rol
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class RolRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def crear(self, nombre):
        rol = Rol(nombre=nombre)
        self.db.add(rol)
        self.db.commit()
        self.db.refresh(rol)
        return rol

    def listar(self):
        return self.db.query(Rol).all()

    def buscar_por_nombre(self, nombre):
        return self.db.query(Rol).filter_by(nombre=nombre).first()
