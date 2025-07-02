from src.feacture.notificacion.model.notificacion import Notificacion
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class NotificacionRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def crear(self, notificacion_dto):
        notificacion = Notificacion(
            usuario_id=notificacion_dto.usuario_id,
            tipo_usuario=notificacion_dto.tipo_usuario,
            titulo=notificacion_dto.titulo,
            mensaje=notificacion_dto.mensaje,
            evento_relacionado=notificacion_dto.evento_relacionado,
            referencia_id=notificacion_dto.referencia_id,
            fecha_envio=notificacion_dto.fecha_envio,
            leida=notificacion_dto.leida
        )
        self.db.add(notificacion)
        self.db.commit()
        self.db.refresh(notificacion)
        return notificacion

    def listar_por_usuario(self, usuario_id, tipo_usuario):
        return self.db.query(Notificacion).filter_by(usuario_id=usuario_id, tipo_usuario=tipo_usuario).order_by(Notificacion.fecha_envio.desc()).all()

    def marcar_leida(self, notificacion_id):
        noti = self.db.query(Notificacion).filter_by(id=notificacion_id).first()
        if noti:
            noti.leida = 1
            self.db.commit()
        return noti
