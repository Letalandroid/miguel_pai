from src.feacture.rol.repository.rol_repository import RolRepository
from src.feacture.rol.dto.rol_dto import RolDTO

class RolService:
    def __init__(self, repository=None):
        self.repository = repository or RolRepository()

    def crear_rol(self, nombre):
        return self.repository.crear(nombre)

    def listar_roles(self):
        return self.repository.listar()

    def buscar_por_nombre(self, nombre):
        return self.repository.buscar_por_nombre(nombre)
