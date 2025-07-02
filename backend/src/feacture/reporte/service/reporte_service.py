from src.feacture.reporte.repository.reporte_repository import ReporteRepository
import pandas as pd
from fpdf import FPDF

class ReporteService:
    def __init__(self, repository=None):
        self.repository = repository or ReporteRepository()

    def resumen_reuniones(self):
        return self.repository.resumen_reuniones()

    def porcentaje_asistencia(self):
        return self.repository.porcentaje_asistencia()

    def carreras_mayor_participacion(self):
        return self.repository.carreras_mayor_participacion()

    def egresados_atendidos(self):
        return self.repository.egresados_atendidos()

    def historial_reuniones_egresado(self, egresado_id):
        return self.repository.historial_reuniones_egresado(egresado_id)

    def exportar_excel(self, data, filename):
        df = pd.DataFrame(data)
        df.to_excel(filename, index=False)
        return filename

    def exportar_pdf(self, data, filename):
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        for row in data:
            pdf.cell(200, 10, txt=str(row), ln=True)
        pdf.output(filename)
        return filename
