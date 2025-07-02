from datetime import datetime

class NotificacionDTO:
    def __init__(self, usuario_id, tipo_usuario, titulo, mensaje, evento_relacionado=None, referencia_id=None):
        if not usuario_id or not tipo_usuario or not titulo or not mensaje:
            raise ValueError("Datos obligatorios faltantes para la notificación")
        self.usuario_id = usuario_id
        self.tipo_usuario = tipo_usuario
        self.titulo = titulo
        self.mensaje = mensaje
        self.evento_relacionado = evento_relacionado
        self.referencia_id = referencia_id
        self.fecha_envio = datetime.utcnow()
        self.leida = 0
