import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({ hash, language }) {

  const doc = new PDFDocument()

  const buffers = []

  doc.on("data", buffers.push.bind(buffers))

  const title =
    language === "pt"
      ? "Certificado GuardianChain"
      : "GuardianChain Certificate"

  const description =
    language === "pt"
      ? "Este documento certifica prova de existência e autoria."
      : "This document certifies proof of existence and authorship."

  const dateLabel = language === "pt" ? "Data" : "Date"
  const networkLabel = language === "pt" ? "Rede" : "Network"

  doc.fontSize(24).text(title, 50, 50)

  doc.moveDown()

  doc.fontSize(12).text(`Hash: ${hash}`)

  doc.text(`${dateLabel}: ${new Date().toISOString()}`)

  doc.text(`${networkLabel}: Polygon`)

  doc.moveDown()

  doc.text(description)

  const qr = await QRCode.toDataURL(hash)

  const qrImage = qr.replace(/^data:image\/png;base64,/, "")

  const qrBuffer = Buffer.from(qrImage, "base64")

  doc.image(qrBuffer, 50, 200, { width: 120 })

  doc.end()

  return new Promise((resolve) => {

    doc.on("end", () => {

      const pdfData = Buffer.concat(buffers)

      resolve(pdfData)

    })

  })

}