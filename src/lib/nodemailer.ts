import nodemailer from 'nodemailer';

const isDev = process.env.NODE_ENV !== 'production';

export const nodemailerTransport = nodemailer.createTransport({
  host: isDev ? 'localhost' : process.env.SMTP_HOST,
  port: isDev ? 587 : parseInt(process.env.SMTP_PORT || '587'),
  secure: !isDev,
  auth: isDev ? undefined : {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
