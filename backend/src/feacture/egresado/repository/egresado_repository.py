from sqlalchemy.orm import Session
from src.config.db import SessionLocal
from src.feacture.egresado.model.egresado import Egresado

# Repositorio de egresados
# Autor: GitHub Copilot

class EgresadoRepository:
    def __init__(self):
        self.db: Session = SessionLocal()

    def registrar(self, egresado_dto):
        if self.db.query(Egresado).filter_by(usuario_dni=egresado_dto.dni).first():
            raise ValueError("El egresado ya está registrado")
        egresado = Egresado(
            id=egresado_dto.dni,
            usuario_dni=egresado_dto.dni,
            nombres=egresado_dto.nombres,
            apellidos=egresado_dto.apellidos,
            email=egresado_dto.email,
            password=egresado_dto.password,
            carrera_profesional=egresado_dto.carrera_profesional,
            anio_egreso=egresado_dto.anio_egreso,
            genero=egresado_dto.genero,
            fecha_nacimiento=egresado_dto.fecha_nacimiento,
            ciudad=egresado_dto.ciudad
        )
        self.db.add(egresado)
        self.db.commit()
        self.db.refresh(egresado)
        return True

    def editar(self, dni, egresado_dto):
        egresado = self.db.query(Egresado).filter_by(usuario_dni=dni).first()
        if not egresado:
            raise ValueError("Egresado no encontrado")
        egresado.nombres = egresado_dto.nombres
        egresado.apellidos = egresado_dto.apellidos
        egresado.email = egresado_dto.email
        egresado.carrera_profesional = egresado_dto.carrera_profesional
        egresado.genero = egresado_dto.genero
        egresado.fecha_nacimiento = egresado_dto.fecha_nacimiento
        self.db.commit()
        return True

    def actualizar_contacto(self, dni, contacto_dto):
        egresado = self.db.query(Egresado).filter_by(usuario_dni=dni).first()
        if not egresado:
            raise ValueError("Egresado no encontrado")
        egresado.email_alternativo = contacto_dto.email_alternativo
        egresado.telefono = contacto_dto.telefono
        self.db.commit()
        return True

    def filtrar(self, filtros):
        query = self.db.query(Egresado)
        if filtros["carrera"]:
            query = query.filter(Egresado.carrera_profesional == filtros["carrera"])
        if filtros["genero"]:
            query = query.filter(Egresado.genero == filtros["genero"])
        if filtros["anio_egreso"]:
            query = query.filter(Egresado.anio_egreso == filtros["anio_egreso"])
        if filtros["ciudad"]:
            query = query.filter(Egresado.ciudad == filtros["ciudad"])
        return [e.__dict__ for e in query.all()]

    def buscar_por_dni(self, dni):
        return self.db.query(Egresado).filter_by(usuario_dni=dni).first()

    def autenticar(self, email, password):
        egresado = self.db.query(Egresado).filter_by(email=email, password=password).first()
        if egresado:
            return egresado.__dict__
        return None

    def recuperar_password(self, email):
        egresado = self.db.query(Egresado).filter_by(email=email).first()
        if not egresado:
            raise ValueError("Email no registrado")
        # Simula envío de correo
        return {"msg": f"Se ha enviado un correo de recuperación a {email}"}
