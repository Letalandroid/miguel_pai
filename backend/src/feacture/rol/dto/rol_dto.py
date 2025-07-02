class RolDTO:
    def __init__(self, nombre):
        if not nombre:
            raise ValueError("El nombre del rol es obligatorio")
        self.nombre = nombre
