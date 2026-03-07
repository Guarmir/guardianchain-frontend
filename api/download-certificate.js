import generateCertificate from "./generate-certificate.js"

export default async function handler(req, res) {

  try {

    const { hash } = req.query

    if (!hash) {

      return res.status(400).json({
        error: "Hash não fornecido"
      })

    }

    const pdfBuffer = await generateCertificate({
      hash,
      language: "pt"
    })

    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    res.status(200).send(pdfBuffer)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Erro ao gerar certificado"
    })

  }

}