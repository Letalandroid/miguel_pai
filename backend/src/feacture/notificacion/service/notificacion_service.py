from src.feacture.notificacion.repository.notificacion_repository import NotificacionRepository
from src.feacture.notificacion.dto.notificacion_dto import NotificacionDTO
from src.utils.email_sender import EmailSender
from src.config import email as email_config
from datetime import datetime, timedelta

class NotificacionService:
    def __init__(self, repository=None):
        self.repository = repository or NotificacionRepository()

    def crear_notificacion(self, notificacion_dto: NotificacionDTO):
        return self.repository.crear(notificacion_dto)

    def listar_notificaciones_usuario(self, usuario_id, tipo_usuario):
        return self.repository.listar_por_usuario(usuario_id, tipo_usuario)

    def marcar_leida(self, notificacion_id):
        return self.repository.marcar_leida(notificacion_id)

    def notificar_por_correo(self, to_email, subject, body):
        sender = EmailSender(
            email_config.EMAIL_SMTP_SERVER,
            email_config.EMAIL_SMTP_PORT,
            email_config.EMAIL_SMTP_USER,
            email_config.EMAIL_SMTP_PASSWORD,
            email_config.EMAIL_FROM_NAME
        )
        return sender.send_email(to_email, subject, body)

    def notificar_evento_reunion(self, egresado_id, email, tipo_evento, fecha, hora, reunion_id=None, observaciones=None):
        # tipo_evento: 'agendada', 'modificada', 'cancelada', 'recordatorio', 'alerta_no_confirmada'
        titulos = {
            'agendada': 'Reunión agendada',
            'modificada': 'Reunión modificada',
            'cancelada': 'Reunión cancelada',
            'recordatorio': 'Recordatorio de reunión',
            'alerta_no_confirmada': 'Reunión pendiente de confirmación'
        }
        mensajes = {
            'agendada': f'Su reunión ha sido agendada para el {fecha} a las {hora}.',
            'modificada': f'Su reunión ha sido modificada para el {fecha} a las {hora}.',
            'cancelada': f'Su reunión para el {fecha} a las {hora} ha sido cancelada.',
            'recordatorio': f'Recuerde su reunión programada para el {fecha} a las {hora}.',
            'alerta_no_confirmada': f'Tiene una reunión pendiente de confirmación para el {fecha} a las {hora}.'
        }
        titulo = titulos.get(tipo_evento, 'Notificación')
        mensaje = mensajes.get(tipo_evento, 'Tiene un evento en el sistema.')
        # Enviar correo
        sender = EmailSender(
            email_config.EMAIL_SMTP_SERVER,
            email_config.EMAIL_SMTP_PORT,
            email_config.EMAIL_SMTP_USER,
            email_config.EMAIL_SMTP_PASSWORD,
            email_config.EMAIL_FROM_NAME
        )
        sender.send_email(email, titulo, mensaje)
        # Registrar notificación
        noti = NotificacionDTO(
            usuario_id=egresado_id,
            tipo_usuario="egresado",
            titulo=titulo,
            mensaje=mensaje,
            evento_relacionado="reunion",
            referencia_id=reunion_id
        )
        self.crear_notificacion(noti)
