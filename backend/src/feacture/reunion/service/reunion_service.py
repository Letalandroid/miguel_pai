from src.feacture.reunion.repository.reunion_repository import ReunionRepository
from src.feacture.notificacion.service.notificacion_service import NotificacionService
from src.feacture.notificacion.dto.notificacion_dto import NotificacionDTO

class ReunionService:
    def __init__(self, repository=None):
        self.repository = repository or ReunionRepository()
        self.notificacion_service = NotificacionService()

    def solicitar_reunion(self, egresado_id, fecha, hora, observaciones=None, email_egresado=None):
        reunion = self.repository.solicitar_reunion(egresado_id, fecha, hora, observaciones)
        if email_egresado:
            self.notificacion_service.notificar_evento_reunion(
                egresado_id, email_egresado, 'agendada', fecha, hora, reunion_id=reunion.id
            )
        noti = NotificacionDTO(
            usuario_id=egresado_id,
            tipo_usuario="egresado",
            titulo="Solicitud de reunión registrada",
            mensaje=f"Su solicitud de reunión para el {fecha} a las {hora} ha sido registrada.",
            evento_relacionado="reunion",
            referencia_id=reunion.id
        )
        self.notificacion_service.crear_notificacion(noti)
        return reunion

    def modificar_reunion(self, reunion_id, nueva_fecha, nueva_hora, email_egresado=None, egresado_id=None):
        reunion = self.repository.modificar_reunion(reunion_id, nueva_fecha, nueva_hora)
        if email_egresado and egresado_id:
            self.notificacion_service.notificar_evento_reunion(
                egresado_id, email_egresado, 'modificada', nueva_fecha, nueva_hora, reunion_id=reunion_id
            )
        return reunion

    def cancelar_reunion(self, reunion_id, fecha, hora, email_egresado=None, egresado_id=None):
        reunion = self.repository.cancelar_reunion(reunion_id)
        if email_egresado and egresado_id:
            self.notificacion_service.notificar_evento_reunion(
                egresado_id, email_egresado, 'cancelada', fecha, hora, reunion_id=reunion_id
            )
        return reunion

    def enviar_recordatorio(self, egresado_id, email_egresado, fecha, hora, reunion_id):
        self.notificacion_service.notificar_evento_reunion(
            egresado_id, email_egresado, 'recordatorio', fecha, hora, reunion_id=reunion_id
        )

    def alerta_no_confirmada(self, egresado_id, email_egresado, fecha, hora, reunion_id):
        self.notificacion_service.notificar_evento_reunion(
            egresado_id, email_egresado, 'alerta_no_confirmada', fecha, hora, reunion_id=reunion_id
        )
