from fastapi import APIRouter, Query, Response, Depends
from src.feacture.reporte.service.reporte_service import ReporteService
from src.utils.auth import AuthService
import os

router = APIRouter()
service = ReporteService()
auth_service = AuthService()

@router.get('/resumen')
def resumen_reuniones(user=Depends(auth_service.require_role("admin"))):
    return service.resumen_reuniones()

@router.get('/porcentaje-asistencia')
def porcentaje_asistencia(user=Depends(auth_service.require_role("admin"))):
    return {"porcentaje": service.porcentaje_asistencia()}

@router.get('/carreras-mayor-participacion')
def carreras_mayor_participacion(user=Depends(auth_service.require_role("admin"))):
    return service.carreras_mayor_participacion()

@router.get('/egresados-atendidos')
def egresados_atendidos(user=Depends(auth_service.require_role("admin"))):
    return {"total": service.egresados_atendidos()}

@router.get('/historial-reuniones/{egresado_id}')
def historial_reuniones_egresado(egresado_id: str, user=Depends(auth_service.require_role("admin"))):
    return service.historial_reuniones_egresado(egresado_id)

@router.get('/exportar-excel')
def exportar_excel(tipo: str = Query(...), user=Depends(auth_service.require_role("admin"))):
    if tipo == "resumen":
        data = [service.resumen_reuniones()]
    elif tipo == "carreras":
        data = service.carreras_mayor_participacion()
    else:
        data = []
    filename = "reporte.xlsx"
    service.exportar_excel(data, filename)
    with open(filename, "rb") as f:
        content = f.read()
    os.remove(filename)
    return Response(content, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

@router.get('/exportar-pdf')
def exportar_pdf(tipo: str = Query(...), user=Depends(auth_service.require_role("admin"))):
    if tipo == "resumen":
        data = [service.resumen_reuniones()]
    elif tipo == "carreras":
        data = service.carreras_mayor_participacion()
    else:
        data = []
    filename = "reporte.pdf"
    service.exportar_pdf(data, filename)
    with open(filename, "rb") as f:
        content = f.read()
    os.remove(filename)
    return Response(content, media_type="application/pdf")
