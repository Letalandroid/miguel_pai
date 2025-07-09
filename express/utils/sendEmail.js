import { AUTH_PASS, AUTH_USER } from "../config/constants.js";
import nodemailer from 'nodemailer';

export const sendEmail = async (emails, subject, html) => {

  const content = html;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: AUTH_USER,
      pass: AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify(function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log("📩 Server is ready to take our messages");
    }
  });

  const mailOptions = {
    from: `"Universidad César Vallejo" <${AUTH_USER}>`,
    to: emails,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
      return error;
    } else {
      console.log(`Correo enviado a => ${emails}`);
      return `Facturada Success a => ${emails}`;
    }
  });
};