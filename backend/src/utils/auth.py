from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.feacture.usuario.repository.usuario_repository import UsuarioRepository
from src.feacture.rol.repository.rol_repository import RolRepository

SECRET_KEY = "supersecretkey"  # Cambia esto en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/usuario/login")

class AuthService:
    def __init__(self):
        self.usuario_repo = UsuarioRepository()
        self.rol_repo = RolRepository()

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return pwd_context.hash(password)

    def authenticate_user(self, email, password):
        user = self.usuario_repo.buscar_por_email(email)
        if not user or not self.verify_password(password, user.password):
            return None
        return user

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: int = payload.get("sub")
            if user_id is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        user = self.usuario_repo.db.query(self.usuario_repo.db.query(UsuarioRepository).first().__class__).filter_by(id=user_id).first()
        if user is None:
            raise credentials_exception
        return user

    def require_role(self, required_role: str):
        def role_checker(user=Depends(self.get_current_user)):
            rol = self.rol_repo.db.query(self.rol_repo.db.query(RolRepository).first().__class__).filter_by(id=user.rol_id).first()
            if not rol or rol.nombre != required_role:
                raise HTTPException(status_code=403, detail="No autorizado para esta acción")
            return user
        return role_checker
