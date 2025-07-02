from src.feacture.auditoria.repository.auditoria_repository import AuditoriaRepository
from src.feacture.auditoria.dto.auditoria_dto import AuditoriaDTO

class AuditoriaService:
    def __init__(self, repository=None):
        self.repository = repository or AuditoriaRepository()

    def registrar(self, auditoria_dto: AuditoriaDTO):
        return self.repository.registrar(auditoria_dto)

    def listar(self):
        return self.repository.listar()

    def listar_por_usuario(self, usuario_id):
        return self.repository.listar_por_usuario(usuario_id)
