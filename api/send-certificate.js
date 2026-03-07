import generateCertificate from "./generate-certificate.js"

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Método não permitido"
    })
  }

  try {

    const { hash, language } = req.body

    if (!hash) {
      return res.status(400).json({
        message: "Hash não informado"
      })
    }

    // detectar idioma corretamente

    let lang = "en"

    if (language) {

      lang = language.startsWith("pt") ? "pt" : "en"

    } else {

      const browserLang = req.headers["accept-language"] || ""

      lang = browserLang.startsWith("pt") ? "pt" : "en"

    }

    const pdfBuffer = await generateCertificate({
      hash,
      language: lang
    })

    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    res.send(pdfBuffer)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Erro ao gerar certificado"
    })

  }

}