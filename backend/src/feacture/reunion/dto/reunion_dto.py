from datetime import date, time

class ReunionDTO:
    def __init__(self, egresado_id, fecha, hora, estado="pendiente", observaciones=None):
        if not egresado_id:
            raise ValueError("El ID del egresado es obligatorio")
        if not fecha or not isinstance(fecha, (str, date)):
            raise ValueError("La fecha es obligatoria y debe ser válida")
        if not hora or not isinstance(hora, (str, time)):
            raise ValueError("La hora es obligatoria y debe ser válida")
        if estado not in ["pendiente", "confirmada", "cancelada", "realizada"]:
            raise ValueError("Estado de reunión inválido")
        self.egresado_id = egresado_id
        self.fecha = fecha
        self.hora = hora
        self.estado = estado
        self.observaciones = observaciones
