import generateCertificate from "./generate-certificate.js"

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" })
  }

  try {

    const { hash, email } = req.body

    if (!hash) {
      return res.status(400).json({ message: "Hash não informado" })
    }

    // FORÇA idioma português

    const certificate = await generateCertificate({
      hash,
      language: "pt"
    })

    // download direto caso não tenha email

    if (!email) {

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=guardianchain-certificate.pdf"
      )

      return res.send(certificate)

    }

    return res.status(200).json({
      success: true
    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({
      error: "Erro ao gerar certificado"
    })

  }

}