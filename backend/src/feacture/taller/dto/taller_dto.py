class TallerDTO:
    def __init__(self, titulo, descripcion, fecha, hora, enlace, flyer=None):
        if not titulo or not descripcion or not fecha or not hora or not enlace:
            raise ValueError("Todos los campos obligatorios deben estar completos")
        self.titulo = titulo
        self.descripcion = descripcion
        self.fecha = fecha
        self.hora = hora
        self.enlace = enlace
        self.flyer = flyer
