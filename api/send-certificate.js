import generateCertificate from "./generate-certificate.js"
import nodemailer from "nodemailer"

export default async function sendCertificate({ hash, language, email }) {

  const pdfBuffer = await generateCertificate({
    hash,
    language
  })

  if (!email) return pdfBuffer

  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }

  })

  await transporter.sendMail({

    from: `"GuardianChain" <${process.env.SMTP_USER}>`,

    to: email,

    subject:
      language === "pt"
        ? "Seu certificado GuardianChain"
        : "Your GuardianChain certificate",

    text:
      language === "pt"
        ? "Seu certificado está anexado."
        : "Your certificate is attached.",

    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer
      }
    ]

  })

  return pdfBuffer

}