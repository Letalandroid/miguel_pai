from src.feacture.taller.model.taller import Taller
"""
Repositorio para gestionar operaciones CRUD sobre la entidad Taller.

Métodos:
    crear(taller_dto): Crea un nuevo taller en la base de datos a partir de un DTO.
    editar(taller_id, taller_dto): Edita los datos de un taller existente identificado por su ID.
    eliminar(taller_id): Elimina un taller de la base de datos por su ID.
    listar(): Retorna una lista de todos los talleres ordenados por fecha ascendente.
    obtener(taller_id): Obtiene un taller específico por su ID.
    incrementar_acceso(taller_id): Incrementa el contador de accesos de un taller.
"""
from src.config.db import SessionLocal
from sqlalchemy.orm import Session


class TallerRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def crear(self, taller_dto):
        taller = Taller(
            titulo=taller_dto.titulo,
            descripcion=taller_dto.descripcion,
            fecha=taller_dto.fecha,
            hora=taller_dto.hora,
            enlace=taller_dto.enlace,
            flyer=taller_dto.flyer
        )
        self.db.add(taller)
        self.db.commit()
        self.db.refresh(taller)
        return taller

    def editar(self, taller_id, taller_dto):
        taller = self.db.query(Taller).filter_by(id=taller_id).first()
        if not taller:
            raise ValueError("Taller no encontrado")
        taller.titulo = taller_dto.titulo
        taller.descripcion = taller_dto.descripcion
        taller.fecha = taller_dto.fecha
        taller.hora = taller_dto.hora
        taller.enlace = taller_dto.enlace
        taller.flyer = taller_dto.flyer
        self.db.commit()
        return taller

    def eliminar(self, taller_id):
        taller = self.db.query(Taller).filter_by(id=taller_id).first()
        if not taller:
            raise ValueError("Taller no encontrado")
        self.db.delete(taller)
        self.db.commit()
        return True

    def listar(self):
        return self.db.query(Taller).order_by(Taller.fecha.asc()).all()

    def obtener(self, taller_id):
        return self.db.query(Taller).filter_by(id=taller_id).first()

    def incrementar_acceso(self, taller_id):
        taller = self.db.query(Taller).filter_by(id=taller_id).first()
        if taller:
            taller.accesos += 1
            self.db.commit()
        return taller
