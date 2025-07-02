from fastapi import APIRouter, HTTPException

from src.feacture.calendario_encargado.service.calendario_service import CalendarioService
from src.feacture.calendario_encargado.dto.calendario_dto import FechaDisponibleDTO, SolicitudReunionDTO, EstadoReunionDTO

"""
Controlador de la API para la gestión del calendario de reuniones de encargados.

Rutas:
- GET /fechas-disponibles: Lista las fechas disponibles para agendar reuniones.
- POST /solicitar-reunion: Permite a un usuario solicitar una reunión, recibiendo los datos de la solicitud en el cuerpo de la petición.
- PUT /cambiar-estado-reunion: Cambia el estado de una reunión existente, recibiendo los datos del nuevo estado en el cuerpo de la petición.
- GET /historial-reuniones/{egresado_id}: Obtiene el historial de reuniones de un egresado específico.

Este controlador utiliza el servicio CalendarioService para manejar la lógica de negocio y los DTOs para validar y transferir los datos de entrada y salida.
"""

router = APIRouter()
service = CalendarioService()

@router.get('/fechas-disponibles')
def listar_fechas_disponibles():
    return service.listar_fechas_disponibles()

@router.post('/solicitar-reunion')
def solicitar_reunion(data: dict):
    try:
        solicitud_dto = SolicitudReunionDTO(**data)
        return service.solicitar_reunion(solicitud_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/cambiar-estado-reunion')
def cambiar_estado_reunion(data: dict):
    try:
        estado_dto = EstadoReunionDTO(**data)
        return service.cambiar_estado_reunion(estado_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/historial-reuniones/{egresado_id}')
def historial_reuniones_egresado(egresado_id: str):
    return service.historial_reuniones_egresado(egresado_id)
