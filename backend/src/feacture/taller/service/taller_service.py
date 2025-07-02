from src.feacture.taller.repository.taller_repository import TallerRepository
from src.feacture.taller.dto.taller_dto import TallerDTO

class TallerService:
    def __init__(self, repository=None):
        self.repository = repository or TallerRepository()

    def crear_taller(self, taller_dto: TallerDTO):
        return self.repository.crear(taller_dto)

    def editar_taller(self, taller_id, taller_dto: TallerDTO):
        return self.repository.editar(taller_id, taller_dto)

    def eliminar_taller(self, taller_id):
        return self.repository.eliminar(taller_id)

    def listar_talleres(self):
        return self.repository.listar()

    def obtener_taller(self, taller_id):
        return self.repository.obtener(taller_id)

    def acceder_taller(self, taller_id):
        return self.repository.incrementar_acceso(taller_id)
