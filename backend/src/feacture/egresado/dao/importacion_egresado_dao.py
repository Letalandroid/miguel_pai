class ImportacionEgresadoDAO:
    def __init__(self, id, usuario_id, fecha, total_registros, exitosos, rechazados, resultado, detalle, archivo_rechazados):
        self.id = id
        self.usuario_id = usuario_id
        self.fecha = fecha
        self.total_registros = total_registros
        self.exitosos = exitosos
        self.rechazados = rechazados
        self.resultado = resultado
        self.detalle = detalle
        self.archivo_rechazados = archivo_rechazados

    @classmethod
    def from_model(cls, imp):
        return cls(
            id=imp.id,
            usuario_id=imp.usuario_id,
            fecha=imp.fecha,
            total_registros=imp.total_registros,
            exitosos=imp.exitosos,
            rechazados=imp.rechazados,
            resultado=imp.resultado,
            detalle=imp.detalle,
            archivo_rechazados=imp.archivo_rechazados
        )
