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
      if (!hash) throw new Error("Hash is not defined")

      const lang = language === "pt" ? "pt" : "en"
      const now = new Date()

      const shortHash = hash.replace("0x", "").substring(0, 12).toUpperCase()
      const evidenceId = `GC-${now.getUTCFullYear()}-${shortHash}`

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

      const t = {
        pt: {
          title: "Certificado de Evidência GuardianChain",
          subtitle: "Registro de Evidência Digital Verificável",
          description:
            "Este certificado cria uma camada adicional de evidência verificável por meio de hash criptográfico, timestamp, titularidade declarada e verificação pública.",
          evidenceId: "ID da evidência",
          holder: "Titular declarado",
          name: "Nome",
          email: "E-mail",
          type: "Tipo",
          individual: "Pessoa física",
          company: "Empresa",
          declarationTitle: "Declaração do titular",
          declaration:
            "O registrante declarou, sob sua responsabilidade, ser autor, titular, possuir direito legítimo, posse ou custódia autorizada sobre o conteúdo digital representado por este hash criptográfico.",
          technicalTitle: "Dados técnicos da evidência",
          fileName: "Nome do arquivo",
          utc: "Timestamp UTC",
          brazil: "Horário do Brasil",
          network: "Rede blockchain",
          payment: "Referência de pagamento",
          hash: "Hash SHA-256",
          verify: "URL de verificação pública",
          independentTitle: "Verificação independente",
          independent:
            "Este registro pode ser verificado utilizando o hash criptográfico, a URL pública de verificação e os dados do certificado. O arquivo original não é enviado nem armazenado pela GuardianChain.",
          limitationTitle: "Limitação importante",
          limitation:
            "Este certificado comprova a existência deste hash, o timestamp do registro e a declaração do titular. A GuardianChain não valida o conteúdo interno do arquivo, não certifica como ele foi criado ou obtido e não substitui cartório, perícia técnica ou validação judicial formal.",
          footer:
            "GuardianChain — Camada independente de evidência digital verificável.",
        },
        en: {
          title: "GuardianChain Evidence Certificate",
          subtitle: "Verifiable Digital Evidence Record",
          description:
            "This certificate creates an additional verifiable evidence layer using cryptographic hashing, timestamping, declared ownership and public verification.",
          evidenceId: "Evidence ID",
          holder: "Declared holder",
          name: "Name",
          email: "Email",
          type: "Type",
          individual: "Individual",
          company: "Company",
          declarationTitle: "Owner declaration",
          declaration:
            "The registrant declared, under their own responsibility, that they are the author, owner, or have legitimate rights, possession or authorized custody over the digital content represented by this cryptographic hash.",
          technicalTitle: "Technical evidence data",
          fileName: "File name",
          utc: "UTC timestamp",
          brazil: "Brazil time",
          network: "Blockchain network",
          payment: "Payment reference",
          hash: "SHA-256 hash",
          verify: "Public verification URL",
          independentTitle: "Independent verification",
          independent:
            "This record can be verified using the cryptographic hash, the public verification URL and the certificate data. The original file is never uploaded or stored by GuardianChain.",
          limitationTitle: "Important limitation",
          limitation:
            "This certificate proves the existence of this hash, the registration timestamp and the holder declaration. GuardianChain does not validate the internal file content, does not certify how it was created or obtained, and does not replace notarization, forensic analysis or formal judicial validation.",
          footer:
            "GuardianChain — Independent verifiable digital evidence layer.",
        },
      }[lang]

      const doc = new PDFDocument({
        size: "A4",
        margin: 42,
      })

      const buffers = []
      doc.on("data", (chunk) => buffers.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", (err) => reject(err))

      const pageWidth = doc.page.width
      const left = 50
      const width = pageWidth - 100

      doc.rect(0, 0, pageWidth, 105).fill("#1f2a6d")

      doc
        .fillColor("#ffffff")
        .fontSize(22)
        .text(t.title, left, 28, {
          width,
          align: "center",
        })

      doc
        .fontSize(11)
        .text(t.subtitle, left, 62, {
          width,
          align: "center",
        })

      doc.y = 130

      doc
        .fillColor("#111827")
        .fontSize(9.5)
        .text(t.description, left, doc.y, {
          width,
          align: "center",
          lineGap: 2,
        })

      doc.moveDown(1)

      box(doc, left, doc.y, width, 38)
      doc
        .fillColor("#111827")
        .fontSize(10.5)
        .text(`${t.evidenceId}: ${evidenceId}`, left + 14, doc.y - 26, {
          width: width - 28,
        })

      doc.moveDown(1.5)

      title(doc, t.holder)
      field(doc, t.name, ownerName || "-")
      field(doc, t.email, ownerEmail || "-")
      field(doc, t.type, ownerType === "company" ? t.company : t.individual)

      doc.moveDown(0.6)

      title(doc, t.declarationTitle)
      paragraph(doc, t.declaration)

      doc.moveDown(0.6)

      title(doc, t.technicalTitle)
      field(doc, t.fileName, fileName || "-")
      field(doc, t.utc, utc)
      field(doc, t.brazil, brazil)
      field(doc, t.network, "Polygon")
      field(doc, t.payment, paymentId || "-")

      doc.moveDown(0.4)

      title(doc, t.hash)
      doc
        .fillColor("#374151")
        .fontSize(8.5)
        .text(hash, {
          width,
          lineGap: 1,
        })

      doc.moveDown(0.7)

      title(doc, t.verify)

      const qr = await QRCode.toDataURL(verificationUrl)
      const qrImage = qr.replace(/^data:image\/png;base64,/, "")
      const qrBuffer = Buffer.from(qrImage, "base64")

      const qrSize = 96
      const qrX = pageWidth - left - qrSize
      const qrY = doc.y

      doc.image(qrBuffer, qrX, qrY, {
        fit: [qrSize, qrSize],
      })

      doc
        .fillColor("#1d4ed8")
        .fontSize(8.5)
        .text(verificationUrl, left, qrY + 4, {
          width: width - qrSize - 24,
          link: verificationUrl,
          underline: true,
          lineGap: 1,
        })

      doc.y = qrY + qrSize + 18

      title(doc, t.independentTitle)
      paragraph(doc, t.independent)

      doc.moveDown(0.5)

      title(doc, t.limitationTitle)
      paragraph(doc, t.limitation)

      doc.moveDown(0.8)

      doc
        .moveTo(left, doc.y)
        .lineTo(pageWidth - left, doc.y)
        .strokeColor("#d1d5db")
        .stroke()

      doc.moveDown(0.5)

      doc
        .fillColor("#6b7280")
        .fontSize(8)
        .text(t.footer, left, doc.y, {
          width,
          align: "center",
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function title(doc, text) {
  doc
    .fillColor("#1f2a6d")
    .fontSize(12.5)
    .text(text, {
      width: 500,
    })

  doc.moveDown(0.25)
}

function field(doc, label, value) {
  doc
    .fillColor("#111827")
    .fontSize(9.5)
    .text(`${label}: `, {
      continued: true,
    })

  doc
    .fillColor("#374151")
    .fontSize(9.5)
    .text(String(value), {
      width: 420,
    })

  doc.moveDown(0.18)
}

function paragraph(doc, text) {
  doc
    .fillColor("#374151")
    .fontSize(9)
    .text(text, {
      width: 500,
      lineGap: 2,
    })
}

function box(doc, x, y, w, h) {
  doc
    .roundedRect(x, y, w, h, 8)
    .fillAndStroke("#f3f4f6", "#d1d5db")
}