from src.feacture.egresado.model.importacion_egresado import ImportacionEgresado
from src.config.db import SessionLocal
from sqlalchemy.orm import Session

class ImportacionEgresadoRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def registrar(self, importacion_dto):
        imp = ImportacionEgresado(
            usuario_id=importacion_dto.usuario_id,
            total_registros=importacion_dto.total_registros,
            exitosos=importacion_dto.exitosos,
            rechazados=importacion_dto.rechazados,
            resultado=importacion_dto.resultado,
            detalle=importacion_dto.detalle,
            archivo_rechazados=importacion_dto.archivo_rechazados
        )
        self.db.add(imp)
        self.db.commit()
        self.db.refresh(imp)
        return imp

    def listar(self):
        return self.db.query(ImportacionEgresado).all()
