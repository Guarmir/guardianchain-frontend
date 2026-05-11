import generateCertificate from "./generate-certificate.js"
import nodemailer from "nodemailer"

export default async function handler(req, res) {

  try {

    const pdfBuffer = await generateCertificate({
      hash: "TEST_HASH",
      language: "pt",
      fileName: "teste.txt",
      ownerName: "Teste Usuario",
      ownerEmail: "autoservicosmiranda@gmail.com",
      ownerType: "individual",
      paymentId: "TEST_PAYMENT"
    })

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    await transporter.sendMail({
      from: `"GuardianChain" <${process.env.GMAIL_USER}>`,
      to: "autoservicosmiranda@gmail.com",
      subject: "Teste GuardianChain",
      text: "Teste de envio",
      attachments: [
        {
          filename: "certificate.pdf",
          content: pdfBuffer
        }
      ]
    })

    return res.status(200).json({ success: true })

  } catch (error) {

    console.error("EMAIL TEST ERROR:", error)

    return res.status(500).json({
      error: error.message
    })

  }

}