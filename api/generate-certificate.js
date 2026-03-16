import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({
  hash,
  language,
  fileName = "",
}) {
  return await new Promise(async (resolve, reject) => {
    try {
      if (!hash) {
        throw new Error("Hash is not defined")
      }

      const lang = language === "pt" ? "pt" : "en"

      const text = {
        en: {
          title: "GuardianChain Certificate",
          description: "This document certifies proof of existence and authorship.",
          hash: "Hash",
          fileName: "File name",
          date: "Date (UTC)",
          brazilTime: "Brazil time",
          network: "Network",
          verify: "Verification",
          footer:
            "The original file is never uploaded. Only its cryptographic hash is registered.",
        },
        pt: {
          title: "Certificado GuardianChain",
          description: "Este documento certifica prova de existência e autoria.",
          hash: "Hash",
          fileName: "Nome do arquivo",
          date: "Data (UTC)",
          brazilTime: "Horário do Brasil",
          network: "Rede",
          verify: "Verificação",
          footer:
            "O arquivo original nunca é enviado. Apenas seu hash criptográfico é registrado.",
        },
      }

      const t = text[lang]
      const now = new Date()

      const utc = now.toISOString().replace("T", " ").substring(0, 19) + " UTC"

      const brazil = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now)

      const verificationUrl = `https://guardianchain.online/verify?hash=${encodeURIComponent(
        hash
      )}&lang=${lang}`

      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      })

      const buffers = []

      doc.on("data", (chunk) => buffers.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", (err) => reject(err))

      doc.fontSize(24).text(t.title, { align: "center" })
      doc.moveDown(0.5)

      doc.fontSize(12).text(t.description, {
        align: "center",
      })

      doc.moveDown(2)

      doc.fontSize(11).text(`${t.hash}:`)
      doc.fontSize(10).text(hash, {
        width: 500,
      })

      doc.moveDown()

      if (fileName) {
        doc.fontSize(11).text(`${t.fileName}: ${fileName}`)
        doc.moveDown()
      }

      doc.fontSize(11).text(`${t.date}: ${utc}`)
      doc.text(`${t.brazilTime}: ${brazil}`)
      doc.text(`${t.network}: Polygon`)

      doc.moveDown(2)

      doc.fontSize(11).text(`${t.verify}:`)
      doc.fontSize(10).fillColor("blue").text(verificationUrl, {
        link: verificationUrl,
        underline: true,
      })

      doc.fillColor("black")
      doc.moveDown()

      const qr = await QRCode.toDataURL(verificationUrl)
      const qrImage = qr.replace(/^data:image\/png;base64,/, "")
      const qrBuffer = Buffer.from(qrImage, "base64")

      doc.image(qrBuffer, {
        fit: [120, 120],
        align: "left",
      })

      doc.moveDown(2)
      doc.fontSize(10).text(t.footer, {
        align: "left",
      })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}