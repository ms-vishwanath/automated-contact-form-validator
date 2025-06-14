import nodemailer from "nodemailer";
let configOptions: any = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(configOptions);
