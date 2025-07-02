from datetime import date, time
import re

class FechaDisponibleDTO:
    def __init__(self, fecha, hora, descripcion=None):
        if not isinstance(fecha, (str, date)):
            raise ValueError("Fecha inválida")
        if not isinstance(hora, (str, time)):
            raise ValueError("Hora inválida")
        self.fecha = fecha
        self.hora = hora
        self.descripcion = descripcion

class SolicitudReunionDTO:
    def __init__(self, egresado_id, fecha, hora, observaciones=None):
        if not egresado_id:
            raise ValueError("ID de egresado requerido")
        if not isinstance(fecha, (str, date)):
            raise ValueError("Fecha inválida")
        if not isinstance(hora, (str, time)):
            raise ValueError("Hora inválida")
        self.egresado_id = egresado_id
        self.fecha = fecha
        self.hora = hora
        self.observaciones = observaciones

class EstadoReunionDTO:
    def __init__(self, reunion_id, estado, observaciones=None):
        if not reunion_id:
            raise ValueError("ID de reunión requerido")
        if estado not in ["pendiente", "confirmada", "cancelada", "realizada"]:
            raise ValueError("Estado inválido")
        self.reunion_id = reunion_id
        self.estado = estado
        self.observaciones = observaciones
