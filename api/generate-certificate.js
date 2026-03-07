import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({ hash, language }) {

  return new Promise(async (resolve) => {

    const doc = new PDFDocument({ margin: 50 })

    const buffers = []

    doc.on("data", buffers.push.bind(buffers))

    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })

    const lang = language === "pt" ? "pt" : "en"

    const title =
      lang === "pt"
        ? "Certificado GuardianChain"
        : "GuardianChain Certificate"

    const description =
      lang === "pt"
        ? "Este documento certifica prova de existência e autoria."
        : "This document certifies proof of existence and authorship."

    const dateLabel = lang === "pt" ? "Data" : "Date"
    const networkLabel = lang === "pt" ? "Rede" : "Network"
    const verifyLabel = lang === "pt" ? "Verificação" : "Verification"

    const now = new Date()

    const utcTimestamp =
      now.getUTCFullYear() +
      "-" +
      String(now.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getUTCDate()).padStart(2, "0") +
      " " +
      String(now.getUTCHours()).padStart(2, "0") +
      ":" +
      String(now.getUTCMinutes()).padStart(2, "0") +
      ":" +
      String(now.getUTCSeconds()).padStart(2, "0") +
      " UTC"

    const brazilTime = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now)

    const verificationUrl = `https://guardianchain.online/verify?hash=${hash}&lang=${lang}`

    doc.fontSize(24).text(title, { align: "center" })

    doc.moveDown(2)

    doc.fontSize(12)

    doc.text(`Hash: ${hash}`)
    doc.moveDown()

    doc.text(`${dateLabel}: ${utcTimestamp}`)
    doc.text(`Horário Brasil: ${brazilTime}`)
    doc.text(`${networkLabel}: Polygon`)

    doc.moveDown(2)

    doc.text(description)

    doc.moveDown(2)

    doc.text(`${verifyLabel}:`)
    doc.text(verificationUrl)

    doc.moveDown()

    const qrData = await QRCode.toDataURL(verificationUrl)

    const qrImage = qrData.replace(/^data:image\/png;base64,/, "")

    const qrBuffer = Buffer.from(qrImage, "base64")

    doc.image(qrBuffer, { fit: [120, 120] })

    doc.end()

  })

}