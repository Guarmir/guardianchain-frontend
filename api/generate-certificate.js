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
      const shortHash = hash.replace("0x", "").slice(0, 12).toUpperCase()
      const evidenceId = `GC-${now.getUTCFullYear()}-${shortHash}`

      const utc =
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"

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
        margin: 0,
      })

      const buffers = []
      doc.on("data", (chunk) => buffers.push(chunk))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      const pageWidth = doc.page.width
      const left = 56
      const right = 56
      const contentWidth = pageWidth - left - right
      let y = 0

      doc.rect(0, 0, pageWidth, 112).fill("#1f2a6d")

      doc
        .fillColor("#ffffff")
        .fontSize(21)
        .text(t.title, left, 32, {
          width: contentWidth,
          align: "center",
        })

      doc
        .fontSize(11)
        .text(t.subtitle, left, 66, {
          width: contentWidth,
          align: "center",
        })

      y = 138

      doc
        .fillColor("#111827")
        .fontSize(9.2)
        .text(t.description, left, y, {
          width: contentWidth,
          align: "left",
          lineGap: 2,
        })

      y += 36

      doc
        .roundedRect(left, y, contentWidth, 30, 8)
        .fillAndStroke("#f3f4f6", "#d1d5db")

      doc
        .fillColor("#111827")
        .fontSize(10)
        .text(`${t.evidenceId}: ${evidenceId}`, left + 12, y + 9, {
          width: contentWidth - 24,
        })

      y += 48

      drawTitle(doc, t.holder, left, y)
      y += 22

      y = drawLine(doc, `${t.name}: ${ownerName || "-"}`, left, y)
      y = drawLine(doc, `${t.email}: ${ownerEmail || "-"}`, left, y)
      y = drawLine(
        doc,
        `${t.type}: ${ownerType === "company" ? t.company : t.individual}`,
        left,
        y
      )

      y += 12

      drawTitle(doc, t.declarationTitle, left, y)
      y += 22

      doc
        .fillColor("#374151")
        .fontSize(8.8)
        .text(t.declaration, left, y, {
          width: contentWidth,
          lineGap: 2,
        })

      y += 46

      drawTitle(doc, t.technicalTitle, left, y)
      y += 22

      y = drawLine(doc, `${t.fileName}: ${fileName || "-"}`, left, y)
      y = drawLine(doc, `${t.utc}: ${utc}`, left, y)
      y = drawLine(doc, `${t.brazil}: ${brazil}`, left, y)
      y = drawLine(doc, `${t.network}: Polygon`, left, y)
      y = drawLine(doc, `${t.payment}: ${paymentId || "-"}`, left, y)

      y += 10

      drawTitle(doc, t.hash, left, y)
      y += 20

      doc
        .fillColor("#374151")
        .fontSize(8)
        .text(hash, left, y, {
          width: contentWidth,
        })

      y += 30

      drawTitle(doc, t.verify, left, y)
      y += 22

      const qr = await QRCode.toDataURL(verificationUrl)
      const qrImage = qr.replace(/^data:image\/png;base64,/, "")
      const qrBuffer = Buffer.from(qrImage, "base64")

      const qrSize = 92
      const qrX = pageWidth - right - qrSize
      const qrY = y

      doc.image(qrBuffer, qrX, qrY, {
        fit: [qrSize, qrSize],
      })

      doc
        .fillColor("#1d4ed8")
        .fontSize(7.8)
        .text(verificationUrl, left, y, {
          width: contentWidth - qrSize - 24,
          link: verificationUrl,
          underline: true,
          lineGap: 1,
        })

      y += 108

      drawTitle(doc, t.independentTitle, left, y)
      y += 20

      doc
        .fillColor("#374151")
        .fontSize(8.5)
        .text(t.independent, left, y, {
          width: contentWidth,
          lineGap: 2,
        })

      y += 52

      drawTitle(doc, t.limitationTitle, left, y)
      y += 20

      doc
        .fillColor("#374151")
        .fontSize(8.3)
        .text(t.limitation, left, y, {
          width: contentWidth,
          lineGap: 2,
        })

      y += 58

      doc
        .moveTo(left, y)
        .lineTo(pageWidth - right, y)
        .strokeColor("#d1d5db")
        .stroke()

      y += 12

      doc
        .fillColor("#6b7280")
        .fontSize(7.5)
        .text(t.footer, left, y, {
          width: contentWidth,
          align: "center",
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

function drawTitle(doc, text, x, y) {
  doc.fillColor("#1f2a6d").fontSize(12).text(text, x, y)
}

function drawLine(doc, text, x, y) {
  doc
    .fillColor("#111827")
    .fontSize(8.8)
    .text(text, x, y, {
      width: 480,
    })

  return y + 16
}