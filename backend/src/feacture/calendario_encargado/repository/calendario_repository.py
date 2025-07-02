from src.feacture.calendario_encargado.model.calendario import FechasDisponibles, HistorialEstado
from src.feacture.reunion.model.reunion import Reunion
from src.config.db import SessionLocal
from sqlalchemy.orm import Session
from datetime import date, time

class CalendarioRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def listar_fechas_disponibles(self):
        return self.db.query(FechasDisponibles).filter_by(estado="disponible").all()

    def reservar_reunion(self, egresado_id, fecha, hora, observaciones=None):
        # Verifica si la fecha y hora ya están reservadas
        existe = self.db.query(Reunion).filter_by(fecha=fecha, hora=hora, estado="pendiente").first()
        if existe:
            raise ValueError("La fecha y hora ya están reservadas")
        reunion = Reunion(egresado_id=egresado_id, fecha=fecha, hora=hora, observaciones=observaciones)
        self.db.add(reunion)
        self.db.commit()
        self.db.refresh(reunion)
        return reunion

    def cambiar_estado_reunion(self, reunion_id, estado, observaciones=None):
        reunion = self.db.query(Reunion).filter_by(id=reunion_id).first()
        if not reunion:
            raise ValueError("Reunión no encontrada")
        reunion.estado = estado
        self.db.commit()
        # Registrar en historial
        historial = HistorialEstado(reunion_id=reunion_id, estado=estado, fecha_cambio=date.today(), observaciones=observaciones)
        self.db.add(historial)
        self.db.commit()
        return True

    def historial_reuniones_egresado(self, egresado_id):
        return self.db.query(Reunion).filter_by(egresado_id=egresado_id).all()
