from src.feacture.usuario.repository.usuario_repository import UsuarioRepository
from src.feacture.usuario.dto.usuario_dto import UsuarioDTO

class UsuarioService:
    def __init__(self, repository=None):
        self.repository = repository or UsuarioRepository()

    def crear_usuario(self, usuario_dto: UsuarioDTO):
        return self.repository.crear(usuario_dto)

    def editar_usuario(self, usuario_id, usuario_dto: UsuarioDTO):
        return self.repository.editar(usuario_id, usuario_dto)

    def suspender_usuario(self, usuario_id):
        return self.repository.suspender(usuario_id)

    def buscar_por_email(self, email):
        return self.repository.buscar_por_email(email)

    def listar_usuarios(self):
        return self.repository.listar()
