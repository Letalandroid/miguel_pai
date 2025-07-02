from apscheduler.schedulers.background import BackgroundScheduler
from src.feacture.reunion.repository.reunion_repository import ReunionRepository
from src.feacture.notificacion.service.notificacion_service import NotificacionService
from datetime import datetime, timedelta

# Configuración del scheduler
scheduler = BackgroundScheduler()

# Tarea para enviar recordatorios automáticos 24h y 1h antes de la reunión

def enviar_recordatorios_automaticos():
    repo = ReunionRepository()
    noti_service = NotificacionService()
    ahora = datetime.now()
    reuniones = repo.obtener_reuniones_pendientes()
    for reunion in reuniones:
        fecha_hora_reunion = datetime.combine(reunion.fecha, reunion.hora)
        diff = fecha_hora_reunion - ahora
        if timedelta(hours=0) < diff <= timedelta(hours=1):
            # Recordatorio 1 hora antes
            noti_service.enviar_recordatorio(
                reunion.egresado_id, reunion.egresado.email, reunion.fecha, reunion.hora, reunion.id
            )
        elif timedelta(hours=1) < diff <= timedelta(hours=24):
            # Recordatorio 24 horas antes
            noti_service.enviar_recordatorio(
                reunion.egresado_id, reunion.egresado.email, reunion.fecha, reunion.hora, reunion.id
            )

# Tarea para alertar reuniones no confirmadas

def alertar_reuniones_no_confirmadas():
    repo = ReunionRepository()
    noti_service = NotificacionService()
    reuniones = repo.obtener_reuniones_pendientes()
    for reunion in reuniones:
        if reunion.estado == "pendiente":
            noti_service.alerta_no_confirmada(
                reunion.egresado_id, reunion.egresado.email, reunion.fecha, reunion.hora, reunion.id
            )

# Programar tareas
scheduler.add_job(enviar_recordatorios_automaticos, 'interval', minutes=30)
scheduler.add_job(alertar_reuniones_no_confirmadas, 'interval', hours=1)

# Para iniciar el scheduler desde main.py:
# from src.utils.scheduler import scheduler
# scheduler.start()
