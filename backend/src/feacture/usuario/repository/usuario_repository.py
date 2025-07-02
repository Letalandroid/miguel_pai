from src.feacture.usuario.model.usuario import Usuario
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class UsuarioRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def crear(self, usuario_dto):
        usuario = Usuario(
            username=usuario_dto.username,
            email=usuario_dto.email,
            password=usuario_dto.password,
            rol_id=usuario_dto.rol_id,
            estado=usuario_dto.estado
        )
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def editar(self, usuario_id, usuario_dto):
        usuario = self.db.query(Usuario).filter_by(id=usuario_id).first()
        if not usuario:
            raise ValueError("Usuario no encontrado")
        usuario.username = usuario_dto.username
        usuario.email = usuario_dto.email
        usuario.rol_id = usuario_dto.rol_id
        usuario.estado = usuario_dto.estado
        self.db.commit()
        return usuario

    def suspender(self, usuario_id):
        usuario = self.db.query(Usuario).filter_by(id=usuario_id).first()
        if not usuario:
            raise ValueError("Usuario no encontrado")
        usuario.estado = "suspendido"
        self.db.commit()
        return usuario

    def buscar_por_email(self, email):
        return self.db.query(Usuario).filter_by(email=email).first()

    def listar(self):
        return self.db.query(Usuario).all()
