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

    // normaliza idioma (resolve pt-BR, en-US, etc)
    const normalized = (language || "en").toLowerCase()

    const lang = normalized.startsWith("pt") ? "pt" : "en"

    // textos traduzidos
    const texts = {

      pt: {
        title: "Certificado GuardianChain",
        description: "Este documento certifica prova de existência e autoria.",
        hash: "Hash",
        date: "Data",
        brazilTime: "Horário Brasil",
        network: "Rede",
        verify: "Verificação"
      },

      en: {
        title: "GuardianChain Certificate",
        description: "This document certifies proof of existence and authorship.",
        hash: "Hash",
        date: "Date",
        brazilTime: "Brazil Time",
        network: "Network",
        verify: "Verification"
      }

    }

    const t = texts[lang]

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

    const brazilTime = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now)

    const verificationUrl =
      `https://guardianchain.online/verify?hash=${hash}&lang=${lang}`

    // título
    doc.fontSize(24).text(t.title, { align: "center" })

    doc.moveDown(2)

    doc.fontSize(12)

    // hash
    doc.text(`${t.hash}: ${hash}`)
    doc.moveDown()

    // datas
    doc.text(`${t.date}: ${utcTimestamp}`)
    doc.text(`${t.brazilTime}: ${brazilTime}`)
    doc.text(`${t.network}: Polygon`)

    doc.moveDown(2)

    // descrição
    doc.text(t.description)

    doc.moveDown(2)

    // verificação
    doc.text(`${t.verify}:`)
    doc.text(verificationUrl)

    doc.moveDown()

    // QR Code
    const qrData = await QRCode.toDataURL(verificationUrl)

    const qrImage = qrData.replace(/^data:image\/png;base64,/, "")

    const qrBuffer = Buffer.from(qrImage, "base64")

    doc.image(qrBuffer, { fit: [120, 120] })

    doc.end()

  })

}