import nodemailer from "nodemailer"
import generateCertificate from "./generate-certificate.js"

export default async function sendEmail({ hash, language, email }) {

  const pdfBuffer = await generateCertificate({
    hash,
    language
  })

  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }

  })

  const subject =
    language === "pt"
      ? "Seu certificado GuardianChain"
      : "Your GuardianChain certificate"

  const text =
    language === "pt"
      ? "Seu certificado está anexado."
      : "Your certificate is attached."

  await transporter.sendMail({

    from: `"GuardianChain" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,

    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer
      }
    ]

  })

}