class UsuarioDTO:
    def __init__(self, username, email, password, rol_id, estado="activo"):
        if not username or not email or not password or not rol_id:
            raise ValueError("Datos obligatorios faltantes para el usuario")
        self.username = username
        self.email = email
        self.password = password
        self.rol_id = rol_id
        self.estado = estado
