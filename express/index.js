import Express from "express";
import { config } from "dotenv";
import { Resend } from "resend";
import morgan from "morgan";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";
config();

const app = Express();
const resend = new Resend(process.env.RESEND_KEY);

const PORT = process.env.PORT;

app.use(Express.json());
app.use(morgan("dev"));
app.use(cors());

app.post("/sendEmail", async (req, res) => {
  const dataReq = req.body;
  const emails = dataReq.emails.filter((e) => { return e !== '' })

  const data = await sendEmail(emails, dataReq.subject, dataReq.html);
  res.status(200).json({ data });
});

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
