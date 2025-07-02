class AuditoriaDAO:
    def __init__(self, id, usuario_id, accion, detalle, fecha):
        self.id = id
        self.usuario_id = usuario_id
        self.accion = accion
        self.detalle = detalle
        self.fecha = fecha

    @classmethod
    def from_model(cls, auditoria):
        return cls(
            id=auditoria.id,
            usuario_id=auditoria.usuario_id,
            accion=auditoria.accion,
            detalle=auditoria.detalle,
            fecha=auditoria.fecha
        )
