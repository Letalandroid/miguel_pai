class TallerDAO:
    def __init__(self, id, titulo, descripcion, fecha, hora, enlace, flyer, accesos):
        self.id = id
        self.titulo = titulo
        self.descripcion = descripcion
        self.fecha = fecha
        self.hora = hora
        self.enlace = enlace
        self.flyer = flyer
        self.accesos = accesos

    @classmethod
    def from_model(cls, taller):
        return cls(
            id=taller.id,
            titulo=taller.titulo,
            descripcion=taller.descripcion,
            fecha=taller.fecha,
            hora=taller.hora,
            enlace=taller.enlace,
            flyer=taller.flyer,
            accesos=taller.accesos
        )
