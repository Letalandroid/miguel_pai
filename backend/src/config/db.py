# Configuración de SQLAlchemy para persistencia real
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cambia la URL de conexión a MySQL
# Ejemplo: 'mysql+pymysql://usuario:contraseña@localhost:3306/egresados_db'
DATABASE_URL = "mysql+pymysql://root:jose1234@localhost:3306/andy"
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
