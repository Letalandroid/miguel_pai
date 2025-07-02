from fastapi import APIRouter, HTTPException
from src.feacture.notificacion.service.notificacion_service import NotificacionService
from src.feacture.notificacion.dto.notificacion_dto import NotificacionDTO

router = APIRouter()
service = NotificacionService()

@router.post('/')
def crear_notificacion(data: dict):
    try:
        noti_dto = NotificacionDTO(**data)
        return service.crear_notificacion(noti_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/usuario/{usuario_id}/{tipo_usuario}')
def listar_notificaciones_usuario(usuario_id: str, tipo_usuario: str):
    return service.listar_notificaciones_usuario(usuario_id, tipo_usuario)

@router.put('/marcar-leida/{notificacion_id}')
def marcar_leida(notificacion_id: int):
    return service.marcar_leida(notificacion_id)
