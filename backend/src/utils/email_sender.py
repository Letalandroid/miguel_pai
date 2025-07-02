import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

class EmailSender:
    def __init__(self, smtp_server, smtp_port, smtp_user, smtp_password, from_name="Sistema Egresados"):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        self.from_name = from_name

    def send_email(self, to_email, subject, body):
        msg = MIMEMultipart()
        msg['From'] = formataddr((self.from_name, self.smtp_user))
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.smtp_user, to_email, msg.as_string())
            return True
        except Exception as e:
            print(f"Error enviando correo: {e}")
            return False
