import nodemailer from "nodemailer"
import generateCertificate from "./generate-certificate.js"

export default async function sendEmail({
  hash,
  language,
  email,
  fileName = "",
}) {
  const lang = language === "pt" ? "pt" : "en"

  const pdfBuffer = await generateCertificate({
    hash,
    language: lang,
    fileName,
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const subject =
    lang === "pt"
      ? "Seu certificado GuardianChain"
      : "Your GuardianChain certificate"

  const text =
    lang === "pt"
      ? "Seu certificado está anexado a este email."
      : "Your certificate is attached to this email."

  await transporter.sendMail({
    from: `"GuardianChain" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer,
      },
    ],
  })
}