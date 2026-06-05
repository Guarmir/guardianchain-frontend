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

      const now = new Date()

      const evidenceId = `GC-${now.getUTCFullYear()}-${hash
        .substring(0, 12)
        .toUpperCase()}`

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

      const text = {
        en: {
          title: "GuardianChain Evidence Certificate",
          subtitle: "Verifiable Digital Evidence Record",
          description:
            "This certificate creates an additional layer of verifiable evidence using cryptographic hashing, timestamping, declared ownership, and public blockchain verification.",

          evidenceId: "Evidence ID",
          declaredHolder: "Declared certificate holder",
          name: "Name",
          email: "Email",
          type: "Type",
          individual: "Individual",
          company: "Company",

          declarationTitle: "Owner declaration",
          declaration:
            "The registrant declared, under their own responsibility, that they are the author, owner, or have legitimate rights, possession, or authorized custody over the digital content represented by this cryptographic hash at the time of registration.",

          technicalData: "Technical evidence data",
          hash: "SHA-256 hash",
          fileName: "File name",
          date: "Timestamp (UTC)",
          brazilTime: "Brazil time",
          network: "Blockchain network",
          payment: "Stripe payment reference",
          verify: "Public verification URL",

          independentTitle: "Independent verification notice",
          independentText:
            "This evidence record can be verified using the cryptographic hash, the public verification URL, and blockchain registration data. GuardianChain does not need access to the original file to verify the hash.",

          limitationTitle: "Important limitation",
          limitationText:
            "This certificate proves the existence of this exact cryptographic hash, the registration timestamp, and the holder declaration. GuardianChain does not validate the internal content of the file, does not certify how the file was created or obtained, and does not replace notarization, forensic analysis, or formal judicial validation.",

          footer:
            "GuardianChain is a privacy-first digital evidence platform. The original file is not uploaded or stored by GuardianChain.",
        },

        pt: {
          title: "Certificado de Evidência GuardianChain",
          subtitle: "Registro de Evidência Digital Verificável",
          description:
            "Este certificado cria uma camada adicional de evidência verificável utilizando hash criptográfico, timestamp, titularidade declarada e verificação pública em blockchain.",

          evidenceId: "ID da evidência",
          declaredHolder: "Titular declarado do certificado",
          name: "Nome",
          email: "E-mail",
          type: "Tipo",
          individual: "Pessoa física",
          company: "Empresa",

          declarationTitle: "Declaração do titular",
          declaration:
            "O registrante declarou, sob sua própria responsabilidade, ser autor, titular, possuir direito legítimo, posse ou custódia autorizada sobre o conteúdo digital representado por este hash criptográfico no momento do registro.",

          technicalData: "Dados técnicos da evidência",
          hash: "Hash SHA-256",
          fileName: "Nome do arquivo",
          date: "Timestamp (UTC)",
          brazilTime: "Horário do Brasil",
          network: "Rede blockchain",
          payment: "Referência de pagamento Stripe",
          verify: "URL de verificação pública",

          independentTitle: "Aviso de verificação independente",
          independentText:
            "Este registro de evidência pode ser verificado utilizando o hash criptográfico, a URL pública de verificação e os dados de registro em blockchain. O GuardianChain não precisa acessar o arquivo original para verificar o hash.",

          limitationTitle: "Limitação importante",
          limitationText:
            "Este certificado comprova a existência deste hash criptográfico exato, o timestamp do registro e a declaração do titular. A GuardianChain não valida o conteúdo interno do arquivo, não certifica como o arquivo foi criado ou obtido e não substitui cartório, perícia técnica ou validação judicial formal.",

          footer:
            "GuardianChain é uma plataforma de evidência digital focada em privacidade. O arquivo original não é enviado nem armazenado pela GuardianChain.",
        },
      }

      const t = text[lang]

      const doc = new PDFDocument({
        margin: 46,
        size: "A4",
      })

      const buffers = []

      doc.on("data", (chunk) => buffers.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", (err) => reject(err))

      const pageWidth = doc.page.width
      const contentWidth = pageWidth - 92

      doc
        .rect(0, 0, pageWidth, 120)
        .fill("#1f2a6d")

      doc
        .fillColor("#ffffff")
        .fontSize(24)
        .text(t.title, 46, 34, {
          align: "center",
          width: contentWidth,
        })

      doc
        .fontSize(12)
        .text(t.subtitle, 46, 68, {
          align: "center",
          width: contentWidth,
        })

      doc
        .moveDown(3)

      doc.y = 145

      doc
        .fillColor("#111111")
        .fontSize(10)
        .text(t.description, {
          align: "center",
          width: contentWidth,
        })

      doc.moveDown(1.4)

      doc
        .roundedRect(46, doc.y, contentWidth, 42, 8)
        .fillAndStroke("#f3f4f6", "#d1d5db")

      doc
        .fillColor("#111111")
        .fontSize(11)
        .text(`${t.evidenceId}: ${evidenceId}`, 60, doc.y - 31, {
          width: contentWidth - 28,
        })

      doc.moveDown(1.8)

      sectionTitle(doc, t.declaredHolder)
      field(doc, t.name, ownerName || "-")
      field(doc, t.email, ownerEmail || "-")
      field(doc, t.type, ownerType === "company" ? t.company : t.individual)

      doc.moveDown(0.8)

      sectionTitle(doc, t.declarationTitle)
      paragraph(doc, t.declaration)

      doc.moveDown(0.8)

      sectionTitle(doc, t.technicalData)

      field(doc, t.fileName, fileName || "-")
      field(doc, t.date, utc)
      field(doc, t.brazilTime, brazil)
      field(doc, t.network, "Polygon")
      field(doc, t.payment, paymentId || "-")

      doc.moveDown(0.4)

      doc
        .fontSize(10)
        .fillColor("#111111")
        .text(`${t.hash}:`, {
          width: contentWidth,
        })

      doc
        .fontSize(8.5)
        .fillColor("#333333")
        .text(hash, {
          width: contentWidth,
        })

      doc.moveDown(0.9)

      sectionTitle(doc, t.verify)

      doc
        .fontSize(9)
        .fillColor("#1d4ed8")
        .text(verificationUrl, {
          link: verificationUrl,
          underline: true,
          width: contentWidth - 150,
        })

      const qr = await QRCode.toDataURL(verificationUrl)
      const qrImage = qr.replace(/^data:image\/png;base64,/, "")
      const qrBuffer = Buffer.from(qrImage, "base64")

      const qrX = pageWidth - 170
      const qrY = doc.y - 42

      doc.image(qrBuffer, qrX, qrY, {
        fit: [110, 110],
      })

      doc.moveDown(1.2)

      sectionTitle(doc, t.independentTitle)
      paragraph(doc, t.independentText, contentWidth - 130)

      doc.moveDown(0.8)

      sectionTitle(doc, t.limitationTitle)
      paragraph(doc, t.limitationText, contentWidth - 130)

      doc.moveDown(1.4)

      doc
        .moveTo(46, doc.y)
        .lineTo(pageWidth - 46, doc.y)
        .strokeColor("#d1d5db")
        .stroke()

      doc.moveDown(0.8)

      doc
        .fontSize(8)
        .fillColor("#555555")
        .text(t.footer, {
          align: "center",
          width: contentWidth,
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function sectionTitle(doc, text) {
  doc
    .fillColor("#1f2a6d")
    .fontSize(13)
    .text(text, {
      underline: false,
    })

  doc.moveDown(0.35)
}

function field(doc, label, value) {
  doc
    .fillColor("#111111")
    .fontSize(10)
    .text(`${label}: `, {
      continued: true,
    })

  doc
    .fillColor("#333333")
    .fontSize(10)
    .text(String(value))

  doc.moveDown(0.25)
}

function paragraph(doc, text, width = 500) {
  doc
    .fillColor("#333333")
    .fontSize(9.5)
    .text(text, {
      width,
      align: "left",
      lineGap: 2,
    })
}