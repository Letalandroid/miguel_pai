# Controlador de egresados (FastAPI ejemplo)
# Autor: GitHub Copilot

from fastapi import APIRouter, Depends, HTTPException, status, Query
from src.feacture.egresado.service.egresado_service import EgresadoService
from src.feacture.egresado.repository.egresado_repository import EgresadoRepository
from src.feacture.egresado.dto.egresado_dto import EgresadoRegistroDTO, EgresadoContactoDTO

router = APIRouter()
service = EgresadoService(EgresadoRepository())

@router.post('/registro', status_code=201)
def registrar_egresado(data: dict):
    try:
        egresado_dto = EgresadoRegistroDTO(**data)
        service.registrar_egresado(egresado_dto)
        return {"msg": "Egresado registrado exitosamente"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/perfil')
def editar_perfil(dni: str, data: dict):
    try:
        egresado_dto = EgresadoRegistroDTO(**data)
        service.editar_perfil(dni, egresado_dto)
        return {"msg": "Perfil actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/contacto')
def actualizar_contacto(dni: str, data: dict):
    try:
        contacto_dto = EgresadoContactoDTO(**data)
        service.actualizar_contacto(dni, contacto_dto)
        return {"msg": "Contacto actualizado"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/')
def filtrar_egresados(
    carrera: str = Query(None),
    genero: str = Query(None),
    anio_egreso: int = Query(None),
    ciudad: str = Query(None)
):
    filtros = {"carrera": carrera, "genero": genero, "anio_egreso": anio_egreso, "ciudad": ciudad}
    return service.filtrar_egresados(filtros)

@router.post('/login')
def login_egresado(data: dict):
    email = data.get("email")
    password = data.get("password")
    return service.autenticar_egresado(email, password)

@router.post('/recuperar-password')
def recuperar_password(data: dict):
    email = data.get("email")
    return service.recuperar_password(email)
