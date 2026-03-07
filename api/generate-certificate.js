import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({ hash, language }) {

  return new Promise(async (resolve, reject) => {

    try {

      const doc = new PDFDocument()

      const buffers = []

      doc.on("data", buffers.push.bind(buffers))

      doc.on("end", () => {

        const pdfData = Buffer.concat(buffers)

        resolve(pdfData)

      })

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

      // DATA CORRETA EM UTC PADRÃO

      const now = new Date()

      const timestamp =
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

      doc.fontSize(24).text(title, 50, 50)

      doc.moveDown()

      doc.fontSize(12).text(`Hash: ${hash}`)

      doc.text(`${dateLabel}: ${timestamp}`)

      doc.text(`${networkLabel}: Polygon`)

      doc.moveDown()

      doc.text(description)

      const qrData = await QRCode.toDataURL(hash)

      const qrImage = qrData.replace(/^data:image\/png;base64,/, "")

      const qrBuffer = Buffer.from(qrImage, "base64")

      doc.image(qrBuffer, 50, 200, { width: 120 })

      doc.end()

    } catch (error) {

      reject(error)

    }

  })

}