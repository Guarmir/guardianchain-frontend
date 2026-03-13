import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({ hash, language }) {

  return new Promise(async (resolve) => {

    const doc = new PDFDocument({ margin: 50 })

    const buffers = []

    doc.on("data", buffers.push.bind(buffers))

    doc.on("end", () => {
      resolve(Buffer.concat(buffers))
    })

    // idioma determinístico
    const lang = language === "pt" ? "pt" : "en"

    const text = {

      en: {
        title: "GuardianChain Certificate",
        description: "This document certifies proof of existence and authorship.",
        date: "Date",
        network: "Network",
        verify: "Verification"
      },

      pt: {
        title: "Certificado GuardianChain",
        description: "Este documento certifica prova de existência e autoria.",
        date: "Data",
        network: "Rede",
        verify: "Verificação"
      }

    }

    const t = text[lang]

    const now = new Date()

    const utc = now.toISOString().replace("T"," ").substring(0,19) + " UTC"

    const brazil = new Intl.DateTimeFormat("pt-BR",{
      timeZone:"America/Sao_Paulo",
      year:"numeric",
      month:"2-digit",
      day:"2-digit",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    }).format(now)

    const verificationUrl =
      `https://guardianchain.online/verify?hash=${hash}&lang=${lang}`

    doc.fontSize(24).text(t.title,{align:"center"})

    doc.moveDown(2)

    doc.fontSize(12)

    doc.text(`Hash: ${hash}`)
    doc.moveDown()

    doc.text(`${t.date}: ${utc}`)
    doc.text(`Horário Brasil: ${brazil}`)
    doc.text(`${t.network}: Polygon`)

    doc.moveDown(2)

    doc.text(t.description)

    doc.moveDown(2)

    doc.text(`${t.verify}:`)
    doc.text(verificationUrl)

    doc.moveDown()

    const qr = await QRCode.toDataURL(verificationUrl)

    const qrImage = qr.replace(/^data:image\/png;base64,/, "")

    const qrBuffer = Buffer.from(qrImage,"base64")

    doc.image(qrBuffer,{fit:[120,120]})

    doc.end()

  })

}