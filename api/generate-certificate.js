import PDFDocument from "pdfkit"
import QRCode from "qrcode"

export default async function generateCertificate({
  hash,
  language,
  fileName = "",
  ownerName = "",
  ownerEmail = "",
  ownerType = "individual",
  paymentId = "",
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
          description:
            "This document certifies verifiable proof of existence, integrity, and declared ownership.",
          declaredHolder: "Declared certificate holder",
          name: "Name",
          email: "Email",
          type: "Type",
          individual: "Individual",
          company: "Company",
          declarationTitle: "Ownership declaration",
          declaration:
            "The holder declared, under their own responsibility, that they are the author, owner, or have legitimate rights over the content represented by this cryptographic hash.",
          technicalData: "Technical registration data",
          hash: "Hash",
          fileName: "File name",
          date: "Date (UTC)",
          brazilTime: "Brazil time",
          network: "Network",
          payment: "Stripe payment",
          verify: "Verification",
          footer:
            "Notice: this certificate proves the hash existence, registration date, and holder declaration. GuardianChain does not validate the internal file content or perform documentary identity verification in this certificate.",
        },
        pt: {
          title: "Certificado GuardianChain",
          description:
            "Este documento certifica prova verificável de existência, integridade e titularidade declarada.",
          declaredHolder: "Titular declarado do certificado",
          name: "Nome",
          email: "E-mail",
          type: "Tipo",
          individual: "Pessoa física",
          company: "Empresa",
          declarationTitle: "Declaração de titularidade",
          declaration:
            "O titular declarou, sob sua responsabilidade, ser autor, titular ou possuir direito legítimo sobre o conteúdo representado por este hash criptográfico.",
          technicalData: "Dados técnicos do registro",
          hash: "Hash",
          fileName: "Nome do arquivo",
          date: "Data (UTC)",
          brazilTime: "Horário do Brasil",
          network: "Rede",
          payment: "Pagamento Stripe",
          verify: "Verificação",
          footer:
            "Aviso: este certificado comprova a existência do hash, a data do registro e a declaração do titular. A GuardianChain não valida o conteúdo interno do arquivo nem realiza verificação documental de identidade neste certificado.",
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

      doc.fontSize(15).text(t.declaredHolder)
      doc.moveDown(0.4)

      doc.fontSize(11).text(`${t.name}: ${ownerName || "-"}`)
      doc.text(`${t.email}: ${ownerEmail || "-"}`)
      doc.text(
        `${t.type}: ${
          ownerType === "company" ? t.company : t.individual
        }`
      )

      doc.moveDown(1)

      doc.fontSize(15).text(t.declarationTitle)
      doc.moveDown(0.4)

      doc.fontSize(10).text(t.declaration, {
        width: 500,
        align: "left",
      })

      doc.moveDown(1.2)

      doc.fontSize(15).text(t.technicalData)
      doc.moveDown(0.4)

      doc.fontSize(11).text(`${t.hash}:`)
      doc.fontSize(10).text(hash, {
        width: 500,
      })

      doc.moveDown()

      if (fileName) {
        doc.fontSize(11).text(`${t.fileName}: ${fileName}`)
      }

      doc.fontSize(11).text(`${t.date}: ${utc}`)
      doc.text(`${t.brazilTime}: ${brazil}`)
      doc.text(`${t.network}: Polygon`)

      if (paymentId) {
        doc.text(`${t.payment}: ${paymentId}`)
      }

      doc.moveDown(1.5)

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

      doc.fontSize(8).fillColor("#555").text(t.footer, {
        align: "left",
        width: 500,
      })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}