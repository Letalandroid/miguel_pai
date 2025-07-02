from fastapi import APIRouter, HTTPException, Response, UploadFile, File, Depends
from src.feacture.taller.service.taller_service import TallerService
from src.feacture.taller.dto.taller_dto import TallerDTO
from src.utils.auth import AuthService
import shutil
import os

router = APIRouter()
service = TallerService()
auth_service = AuthService()

@router.post('/')
def crear_taller(data: dict, flyer: UploadFile = File(None), user=Depends(auth_service.require_role("admin"))):
    try:
        flyer_path = None
        if flyer:
            flyer_path = f"flyer_{data['titulo']}_{flyer.filename}"
            with open(flyer_path, "wb") as buffer:
                shutil.copyfileobj(flyer.file, buffer)
        taller_dto = TallerDTO(**data, flyer=flyer_path)
        return service.crear_taller(taller_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/{taller_id}')
def editar_taller(taller_id: int, data: dict, flyer: UploadFile = File(None), user=Depends(auth_service.require_role("admin"))):
    try:
        flyer_path = None
        if flyer:
            flyer_path = f"flyer_{data['titulo']}_{flyer.filename}"
            with open(flyer_path, "wb") as buffer:
                shutil.copyfileobj(flyer.file, buffer)
        taller_dto = TallerDTO(**data, flyer=flyer_path)
        return service.editar_taller(taller_id, taller_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete('/{taller_id}')
def eliminar_taller(taller_id: int, user=Depends(auth_service.require_role("admin"))):
    return service.eliminar_taller(taller_id)

@router.get('/')
def listar_talleres():
    return service.listar_talleres()

@router.get('/{taller_id}')
def obtener_taller(taller_id: int):
    return service.obtener_taller(taller_id)

@router.get('/flyer/{taller_id}')
def ver_flyer(taller_id: int):
    taller = service.obtener_taller(taller_id)
    if not taller or not taller.flyer or not os.path.exists(taller.flyer):
        raise HTTPException(status_code=404, detail="Flyer no encontrado")
    with open(taller.flyer, "rb") as f:
        content = f.read()
    return Response(content, media_type="image/jpeg")

@router.get('/acceder/{taller_id}')
def acceder_taller(taller_id: int):
    taller = service.acceder_taller(taller_id)
    if not taller:
        raise HTTPException(status_code=404, detail="Taller no encontrado")
    return {"enlace": taller.enlace}
