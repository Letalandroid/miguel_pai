class ImportacionEgresadoDTO:
    def __init__(self, usuario_id, total_registros, exitosos, rechazados, resultado, detalle=None, archivo_rechazados=None):
        self.usuario_id = usuario_id
        self.total_registros = total_registros
        self.exitosos = exitosos
        self.rechazados = rechazados
        self.resultado = resultado
        self.detalle = detalle
        self.archivo_rechazados = archivo_rechazados
