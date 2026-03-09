import nodemailer from "nodemailer"

export default async function sendCertificate(email, pdfBuffer) {

  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }

  })

  await transporter.sendMail({

    from: `"GuardianChain" <${process.env.SMTP_USER}>`,

    to: email,

    subject: "GuardianChain Certificate",

    text: "Your digital certificate is attached.",

    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer
      }
    ]

  })

}