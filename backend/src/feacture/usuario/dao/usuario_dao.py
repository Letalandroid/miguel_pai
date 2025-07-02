class UsuarioDAO:
    def __init__(self, id, username, email, rol_id, estado):
        self.id = id
        self.username = username
        self.email = email
        self.rol_id = rol_id
        self.estado = estado

    @classmethod
    def from_model(cls, usuario):
        return cls(
            id=usuario.id,
            username=usuario.username,
            email=usuario.email,
            rol_id=usuario.rol_id,
            estado=usuario.estado
        )
