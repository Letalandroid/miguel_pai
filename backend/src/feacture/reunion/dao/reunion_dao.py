class ReunionDAO:
    def __init__(self, id, egresado_id, fecha, hora, estado, observaciones=None):
        self.id = id
        self.egresado_id = egresado_id
        self.fecha = fecha
        self.hora = hora
        self.estado = estado
        self.observaciones = observaciones

    @classmethod
    def from_model(cls, reunion):
        return cls(
            id=reunion.id,
            egresado_id=reunion.egresado_id,
            fecha=reunion.fecha,
            hora=reunion.hora,
            estado=reunion.estado,
            observaciones=reunion.observaciones
        )
