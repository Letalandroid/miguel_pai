from src.feacture.auditoria.model.auditoria import Auditoria
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class AuditoriaRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def registrar(self, auditoria_dto):
        auditoria = Auditoria(
            usuario_id=auditoria_dto.usuario_id,
            accion=auditoria_dto.accion,
            detalle=auditoria_dto.detalle
        )
        self.db.add(auditoria)
        self.db.commit()
        self.db.refresh(auditoria)
        return auditoria

    def listar(self):
        return self.db.query(Auditoria).all()

    def listar_por_usuario(self, usuario_id):
        return self.db.query(Auditoria).filter_by(usuario_id=usuario_id).all()
