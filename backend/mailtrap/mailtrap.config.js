import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import nodemailer from "nodemailer"

dotenv.config();


export const mailtrapClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN,
    endpoint: process.env.MAILTRAP_ENDPOINT
});

export const sender= {
    email: "mailtrap@demomailtrap.com",
    name: "Duraimurugan H",
}; 

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
     user:process.env.MAIL_ID,
     pass:process.env.MAIL_PASSWORD,
    },
   });
