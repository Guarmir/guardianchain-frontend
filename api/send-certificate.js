import nodemailer from "nodemailer"
import generateCertificate from "./generate-certificate.js"

export default async function sendEmail({ hash, language, email, fileName = "" }) {
  if (!email) {
    throw new Error("Recipient email is not defined")
  }

  if (!hash) {
    throw new Error("Hash is not defined")
  }

  if (!process.env.SMTP_HOST) {
    throw new Error("SMTP_HOST is not defined")
  }

  if (!process.env.SMTP_PORT) {
    throw new Error("SMTP_PORT is not defined")
  }

  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined")
  }

  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not defined")
  }

  const lang = language === "pt" ? "pt" : "en"
  const smtpPort = Number(process.env.SMTP_PORT)
  const secure = smtpPort === 465

  console.log("[SEND CERTIFICATE] Preparing email:", {
    email,
    hash,
    language: lang,
    fileName,
  })

  const pdfBuffer = await generateCertificate({
    hash,
    language: lang,
    fileName,
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure,
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
      ? "Seu certificado digital está anexado."
      : "Your digital certificate is attached."

  await transporter.verify()

  await transporter.sendMail({
    from: `"GuardianChain" <${process.env.SMTP_USER}>`,
    to: String(email).trim(),
    subject,
    text,
    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer,
      },
    ],
  })

  console.log("[SEND CERTIFICATE] Email sent successfully to:", email)
}