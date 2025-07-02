from sqlalchemy import func
from src.feacture.reunion.model.reunion import Reunion
from src.feacture.egresado.model.egresado import Egresado
from src.config.db import SessionLocal

class ReporteRepository:
    def __init__(self):
        self.db = SessionLocal()

    def resumen_reuniones(self):
        return {
            'agendadas': self.db.query(Reunion).filter(Reunion.estado == 'pendiente').count(),
            'realizadas': self.db.query(Reunion).filter(Reunion.estado == 'realizada').count(),
            'canceladas': self.db.query(Reunion).filter(Reunion.estado == 'cancelada').count(),
            'confirmadas': self.db.query(Reunion).filter(Reunion.estado == 'confirmada').count(),
        }

    def porcentaje_asistencia(self):
        total = self.db.query(Reunion).count()
        realizadas = self.db.query(Reunion).filter(Reunion.estado == 'realizada').count()
        return (realizadas / total * 100) if total > 0 else 0

    def carreras_mayor_participacion(self):
        return self.db.query(Egresado.carrera_profesional, func.count(Reunion.id).label('total')) \
            .join(Reunion, Reunion.egresado_id == Egresado.id) \
            .group_by(Egresado.carrera_profesional) \
            .order_by(func.count(Reunion.id).desc()) \
            .all()

    def egresados_atendidos(self):
        return self.db.query(Reunion.egresado_id).distinct().count()

    def historial_reuniones_egresado(self, egresado_id):
        return self.db.query(Reunion).filter_by(egresado_id=egresado_id).all()
