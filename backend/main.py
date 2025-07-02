from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.feacture.egresado.controller.egresado_controller import router as egresado_router
from src.feacture.egresado.controller.importacion_egresado_controller import router as importacion_egresado_router
from src.feacture.calendario_encargado.controller.calendario_controller import router as calendario_router
from src.feacture.notificacion.controller.notificacion_controller import router as notificacion_router
from src.feacture.reporte.controller.reporte_controller import router as reporte_router
from src.feacture.usuario.controller.usuario_controller import router as usuario_router
from src.feacture.auditoria.controller.auditoria_controller import router as auditoria_router
from src.feacture.taller.controller.taller_controller import router as taller_router
from src.utils.scheduler import scheduler

app = FastAPI(
    title="FastAPI App",
    description="FastAPI application with Swagger and Redoc documentation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(egresado_router, prefix="/egresado", tags=["Egresado"])
app.include_router(importacion_egresado_router, prefix="/egresado/importacion", tags=["Importación Egresados"])
app.include_router(calendario_router, prefix="/calendario", tags=["Calendario y Reuniones"])
app.include_router(notificacion_router, prefix="/notificacion", tags=["Notificaciones"])
app.include_router(reporte_router, prefix="/reporte", tags=["Reportes y Estadísticas"])
app.include_router(usuario_router, prefix="/usuario", tags=["Usuarios"])
app.include_router(auditoria_router, prefix="/auditoria", tags=["Auditoría"])
app.include_router(taller_router, prefix="/taller", tags=["Talleres"])

# Iniciar el scheduler de tareas automáticas
scheduler.start()

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)