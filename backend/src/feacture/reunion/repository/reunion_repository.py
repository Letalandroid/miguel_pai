from src.feacture.reunion.model.reunion import Reunion
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class ReunionRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def solicitar_reunion(self, egresado_id, fecha, hora, observaciones=None):
        reunion = Reunion(
            egresado_id=egresado_id,
            fecha=fecha,
            hora=hora,
            observaciones=observaciones,
            estado="pendiente"
        )
        self.db.add(reunion)
        self.db.commit()
        self.db.refresh(reunion)
        return reunion

    def modificar_reunion(self, reunion_id, nueva_fecha, nueva_hora):
        reunion = self.db.query(Reunion).filter_by(id=reunion_id).first()
        if not reunion:
            raise ValueError("Reunión no encontrada")
        reunion.fecha = nueva_fecha
        reunion.hora = nueva_hora
        reunion.estado = "pendiente"
        self.db.commit()
        return reunion

    def cancelar_reunion(self, reunion_id):
        reunion = self.db.query(Reunion).filter_by(id=reunion_id).first()
        if not reunion:
            raise ValueError("Reunión no encontrada")
        reunion.estado = "cancelada"
        self.db.commit()
        return reunion

    def obtener_reuniones_pendientes(self):
        return self.db.query(Reunion).filter(Reunion.estado.in_(["pendiente", "confirmada"])).all()
