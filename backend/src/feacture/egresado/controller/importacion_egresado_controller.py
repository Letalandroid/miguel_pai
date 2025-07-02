from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Response
from src.feacture.egresado.service.importacion_egresado_service import ImportacionEgresadoService
from src.utils.auth import AuthService
import shutil
import os

router = APIRouter()
service = ImportacionEgresadoService()
auth_service = AuthService()

@router.post('/importar-excel')
def importar_excel(
    file: UploadFile = File(...),
    usuario_id: int = Form(...),
    user=Depends(auth_service.require_role("admin"))
):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="El archivo debe ser .xlsx")
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    resultado = service.importar_excel(temp_path, usuario_id)
    os.remove(temp_path)
    return resultado

@router.get('/descargar-rechazados')
def descargar_rechazados(nombre: str, user=Depends(auth_service.require_role("admin"))):
    if not os.path.exists(nombre):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    with open(nombre, "rb") as f:
        content = f.read()
    return Response(content, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
