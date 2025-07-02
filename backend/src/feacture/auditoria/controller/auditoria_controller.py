from fastapi import APIRouter, HTTPException
from src.feacture.auditoria.service.auditoria_service import AuditoriaService
from src.feacture.auditoria.dto.auditoria_dto import AuditoriaDTO

router = APIRouter()
service = AuditoriaService()

@router.post('/')
def registrar_auditoria(data: dict):
    try:
        auditoria_dto = AuditoriaDTO(**data)
        return service.registrar(auditoria_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/')
def listar_auditoria():
    return service.listar()

@router.get('/usuario/{usuario_id}')
def listar_auditoria_usuario(usuario_id: int):
    return service.listar_por_usuario(usuario_id)
