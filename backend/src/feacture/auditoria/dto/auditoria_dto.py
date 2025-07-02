class AuditoriaDTO:
    def __init__(self, usuario_id, accion, detalle=None):
        if not usuario_id or not accion:
            raise ValueError("usuario_id y accion son obligatorios")
        self.usuario_id = usuario_id
        self.accion = accion
        self.detalle = detalle
