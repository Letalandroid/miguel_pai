from src.feacture.calendario_encargado.repository.calendario_repository import CalendarioRepository

from src.feacture.calendario_encargado.dto.calendario_dto import FechaDisponibleDTO, SolicitudReunionDTO, EstadoReunionDTO
"""
Servicio para la gestión de calendarios y reuniones de egresados.

Esta clase actúa como intermediario entre la capa de presentación y el repositorio de datos,
permitiendo listar fechas disponibles, solicitar reuniones, cambiar el estado de una reunión
y consultar el historial de reuniones de un egresado.

Métodos:
    - listar_fechas_disponibles(): Retorna una lista de fechas y horas disponibles para agendar reuniones.
    - solicitar_reunion(solicitud_dto): Permite a un egresado solicitar una reunión, reservando una fecha y hora específica.
    - cambiar_estado_reunion(estado_dto): Cambia el estado de una reunión (por ejemplo, aprobada, rechazada, etc.).
    - historial_reuniones_egresado(egresado_id): Devuelve el historial de reuniones solicitadas por un egresado específico.
"""
class CalendarioService:
    def __init__(self, repository=None):
        self.repository = repository or CalendarioRepository()

    def listar_fechas_disponibles(self):
        return self.repository.listar_fechas_disponibles()

    def solicitar_reunion(self, solicitud_dto: SolicitudReunionDTO):
        return self.repository.reservar_reunion(
            solicitud_dto.egresado_id,
            solicitud_dto.fecha,
            solicitud_dto.hora,
            solicitud_dto.observaciones
        )

    def cambiar_estado_reunion(self, estado_dto: EstadoReunionDTO):
        return self.repository.cambiar_estado_reunion(
            estado_dto.reunion_id,
            estado_dto.estado,
            estado_dto.observaciones
        )

    def historial_reuniones_egresado(self, egresado_id):
        return self.repository.historial_reuniones_egresado(egresado_id)
