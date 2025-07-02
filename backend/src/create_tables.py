# Script para crear las tablas de la base de datos usando SQLAlchemy
from src.config.db import Base, engine
from src.feacture.egresado.model.egresado import Egresado
from src.feacture.egresado.model.importacion_egresado import ImportacionEgresado
from src.feacture.taller.model.taller import Taller
from src.feacture.reunion.model.reunion import Reunion
from src.feacture.notificacion.model.notificacion import Notificacion
from src.feacture.usuario.model.usuario import Usuario
from src.feacture.rol.model.rol import Rol
from src.feacture.auditoria.model.auditoria import Auditoria

if __name__ == "__main__":
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("¡Tablas creadas!")
