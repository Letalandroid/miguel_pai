import pandas as pd
from src.feacture.egresado.repository.importacion_egresado_repository import ImportacionEgresadoRepository
from src.feacture.egresado.repository.egresado_repository import EgresadoRepository
from src.feacture.egresado.dto.importacion_egresado_dto import ImportacionEgresadoDTO
from src.feacture.egresado.dto.egresado_dto import EgresadoRegistroDTO
from datetime import datetime

class ImportacionEgresadoService:
    CAMPOS_REQUERIDOS = ["dni", "nombres", "apellidos", "email", "carrera_profesional", "anio_egreso", "genero", "fecha_nacimiento"]

    def __init__(self, repository=None):
        self.repository = repository or ImportacionEgresadoRepository()
        self.egresado_repo = EgresadoRepository()

    def importar_excel(self, file_path, usuario_id):
        df = pd.read_excel(file_path)
        total = len(df)
        exitosos = 0
        rechazados = 0
        errores = []
        for idx, row in df.iterrows():
            error = None
            for campo in self.CAMPOS_REQUERIDOS:
                if pd.isna(row.get(campo)) or str(row.get(campo)).strip() == "":
                    error = f"Campo obligatorio vacío: {campo}"
                    break
            if not error:
                if self.egresado_repo.buscar_por_dni(str(row["dni"])):
                    error = "DNI duplicado"
            if not error:
                try:
                    egresado_dto = EgresadoRegistroDTO(
                        nombres=row["nombres"],
                        apellidos=row["apellidos"],
                        dni=str(row["dni"]),
                        email=row["email"],
                        password=row.get("password", "123456"),
                        carrera_profesional=row["carrera_profesional"],
                        anio_egreso=int(row["anio_egreso"]),
                        genero=row["genero"],
                        fecha_nacimiento=row["fecha_nacimiento"],
                        ciudad=row.get("ciudad")
                    )
                    self.egresado_repo.registrar(egresado_dto)
                    exitosos += 1
                except Exception as ex:
                    error = str(ex)
            if error:
                rechazados += 1
                row_dict = row.to_dict()
                row_dict["motivo_error"] = error
                errores.append(row_dict)
        resultado = "exitoso" if exitosos == total else ("parcial" if exitosos > 0 else "fallido")
        archivo_rechazados = None
        if errores:
            archivo_rechazados = f"rechazados_{datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
            pd.DataFrame(errores).to_excel(archivo_rechazados, index=False)
        detalle = f"Procesados: {total}, Exitosos: {exitosos}, Rechazados: {rechazados}"
        importacion_dto = ImportacionEgresadoDTO(
            usuario_id=usuario_id,
            total_registros=total,
            exitosos=exitosos,
            rechazados=rechazados,
            resultado=resultado,
            detalle=detalle,
            archivo_rechazados=archivo_rechazados
        )
        self.repository.registrar(importacion_dto)
        return {
            "procesados": total,
            "exitosos": exitosos,
            "rechazados": rechazados,
            "archivo_rechazados": archivo_rechazados,
            "errores": errores
        }
