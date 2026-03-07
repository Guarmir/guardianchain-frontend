import generateCertificate from "./generate-certificate"

export default async function handler(req, res) {

  const hash = req.query.hash

  if (!hash) {

    return res.status(400).json({
      message: "Hash não fornecido"
    })

  }

  try {

    const pdf = await generateCertificate({
      hash,
      language: "pt"
    })

    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=GuardianChain_Certificate.pdf"
    )

    res.send(pdf)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Erro ao gerar certificado"
    })

  }

}