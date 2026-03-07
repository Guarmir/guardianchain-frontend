import generateCertificate from "./generate-certificate.js"

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    })
  }

  try {

    const { hash, email, language } = req.body

    if (!hash) {
      return res.status(400).json({
        message: "Hash not provided"
      })
    }

    // detectar idioma

    const lang =
      language && language.startsWith("pt")
        ? "pt"
        : "en"

    const pdfBuffer = await generateCertificate({
      hash,
      language: lang
    })

    res.setHeader("Content-Type", "application/pdf")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=guardianchain-certificate.pdf"
    )

    return res.send(pdfBuffer)

  } catch (error) {

    console.error(error)

    return res.status(500).json({
      error: "Certificate generation error"
    })

  }

}