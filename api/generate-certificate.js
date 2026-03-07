import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({ hash, language }) {

  return new Promise(async (resolve, reject) => {

    try {

      const doc = new PDFDocument({
        size: "A4",
        margin: 50
      })

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

      const now = new Date()

      // UTC (padrão internacional)

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

      // horário local do servidor

      const localTimestamp =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0")

      doc.fontSize(24).text(title, {
        align: "center"
      })

      doc.moveDown(2)

      doc.fontSize(12)

      doc.text(`Hash: ${hash}`)

      doc.moveDown()

      doc.text(`${dateLabel}: ${utcTimestamp}`)

      doc.text(`Local time: ${localTimestamp}`)

      doc.text(`${networkLabel}: Polygon`)

      doc.moveDown(2)

      doc.text(description)

      doc.moveDown(2)

      // gerar QR Code

      const qrData = await QRCode.toDataURL(hash)

      const qrImage = qrData.replace(/^data:image\/png;base64,/, "")

      const qrBuffer = Buffer.from(qrImage, "base64")

      doc.image(qrBuffer, {
        fit: [120, 120],
        align: "left"
      })

      doc.end()

    } catch (error) {

      reject(error)

    }

  })

}