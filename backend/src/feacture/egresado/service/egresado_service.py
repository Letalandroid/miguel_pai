# Servicio de egresados
# Autor: GitHub Copilot

from src.feacture.egresado.repository.egresado_repository import EgresadoRepository
from src.feacture.egresado.dto.egresado_dto import EgresadoRegistroDTO, EgresadoContactoDTO

class EgresadoService:
    def __init__(self, repository=None):
        self.repository = repository or EgresadoRepository()

    def registrar_egresado(self, egresado_dto: EgresadoRegistroDTO):
        if self.repository.buscar_por_dni(egresado_dto.dni):
            raise ValueError("El egresado ya está registrado")
        return self.repository.registrar(egresado_dto)

    def editar_perfil(self, dni, egresado_dto: EgresadoRegistroDTO):
        return self.repository.editar(dni, egresado_dto)

    def actualizar_contacto(self, dni, contacto_dto: EgresadoContactoDTO):
        return self.repository.actualizar_contacto(dni, contacto_dto)

    def filtrar_egresados(self, filtros):
        return self.repository.filtrar(filtros)

    def autenticar_egresado(self, email, password):
        egresado = self.repository.autenticar(email, password)
        if not egresado:
            raise ValueError("Credenciales incorrectas")
        return {"msg": "Autenticación exitosa", "egresado": egresado}

    def recuperar_password(self, email):
        return self.repository.recuperar_password(email)
