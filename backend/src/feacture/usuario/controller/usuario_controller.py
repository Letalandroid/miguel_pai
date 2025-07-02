from fastapi import APIRouter, HTTPException, Depends
from src.feacture.usuario.service.usuario_service import UsuarioService
from src.feacture.usuario.dto.usuario_dto import UsuarioDTO
from src.utils.auth import AuthService

router = APIRouter()
service = UsuarioService()
auth_service = AuthService()

@router.post('/')
def crear_usuario(data: dict):
    try:
        usuario_dto = UsuarioDTO(**data)
        return service.crear_usuario(usuario_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/{usuario_id}')
def editar_usuario(usuario_id: int, data: dict):
    try:
        usuario_dto = UsuarioDTO(**data)
        return service.editar_usuario(usuario_id, usuario_dto)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/suspender/{usuario_id}')
def suspender_usuario(usuario_id: int):
    return service.suspender_usuario(usuario_id)

@router.get('/')
def listar_usuarios():
    return service.listar_usuarios()

@router.post('/login')
def login_usuario(data: dict):
    email = data.get("email")
    password = data.get("password")
    user = auth_service.authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    access_token = auth_service.create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get('/me')
def get_current_user(user=Depends(auth_service.get_current_user)):
    return user

@router.get('/admin-only')
def admin_only(user=Depends(auth_service.require_role("admin"))):
    return {"msg": "Solo para administradores"}
