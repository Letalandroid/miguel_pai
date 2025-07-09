import { Resend } from "resend";

export interface MeetingSend {
  emails: string[];
  graduateName: string;
  comanyName: string;
  type: string;
  dateInit: string;
  dateEnd: string;
}

function generateMeetingHTML(meet: MeetingSend): string {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #07524B;">Nueva Reunión Agendada</h2>
        <p>Estimado/a <strong>${meet.graduateName}</strong>,</p>
        <p>Le informamos que ha sido agendada una reunión con la empresa <strong>${meet.comanyName}</strong>.</p>

        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Tipo:</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${meet.type}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Inicio:</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${meet.dateInit}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Fin:</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${meet.dateEnd}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Por favor, asegúrese de estar disponible en el horario indicado.</p>

        <p style="margin-top: 30px;">Saludos cordiales,<br><strong>Equipo de Coordinación</strong></p>
      </div>
    `;
}

export const sendNotification = async (meet: MeetingSend) => {
  const htmlContent = generateMeetingHTML(meet);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/sendEmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emails: meet.emails,
      subject: meet.type,
      html: htmlContent,
    }),
  });

  console.log(await res.json());
};
