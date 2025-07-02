class RolDAO:
    def __init__(self, id, nombre):
        self.id = id
        self.nombre = nombre

    @classmethod
    def from_model(cls, rol):
        return cls(id=rol.id, nombre=rol.nombre)
