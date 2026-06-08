import crypto from "crypto"

function verifyToken(token, secret) {
  if (!token || !token.includes(".")) {
    throw new Error("Invalid token")
  }

  const [encodedPayload, signature] = token.split(".")

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url")

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid signature")
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8")
  )

  if (!payload.exp || Date.now() > payload.exp) {
    throw new Error("Expired token")
  }

  return payload
}

export default async function handler(req, res) {
  try {
    const token = req.query.token
    const secret = process.env.EMAIL_VERIFICATION_SECRET || process.env.SMTP_PASS

    if (!secret) {
      throw new Error("Verification secret is missing")
    }

    const payload = verifyToken(token, secret)
    const lang = payload.lang === "pt" ? "pt" : "en"

    const verifyUrl = `/verify?hash=${encodeURIComponent(
      payload.hash
    )}&lang=${lang}`

    const html =
      lang === "pt"
        ? `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>E-mail verificado | GuardianChain</title>
</head>
<body style="margin:0;font-family:Arial,sans-serif;background:linear-gradient(180deg,#111827,#4338ca);padding:30px;">
<div style="max-width:720px;margin:60px auto;background:white;border-radius:24px;padding:36px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,0.35);">
<div style="width:54px;height:54px;border-radius:999px;background:#16a34a;color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;margin:0 auto 18px;">✓</div>
<h1>E-mail verificado com sucesso</h1>
<p style="color:#4b5563;line-height:1.6;">O GuardianChain confirmou que o endereço de e-mail declarado recebeu e acessou o link associado a esta prova digital.</p>
<div style="text-align:left;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:16px;padding:18px;margin:24px 0;">
<p><strong>E-mail confirmado:</strong> ${payload.email}</p>
<p><strong>Hash:</strong></p>
<p style="word-break:break-all;font-family:monospace;font-size:13px;">${payload.hash}</p>
</div>
<p style="color:#4b5563;line-height:1.6;">Essa confirmação funciona como uma camada adicional de evidência para demonstrar posse do e-mail declarado.</p>
<a href="${verifyUrl}" style="display:inline-block;margin-top:18px;background:#4338ca;color:white;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:800;">Verificar prova</a>
</div>
</body>
</html>
`
        : `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email verified | GuardianChain</title>
</head>
<body style="margin:0;font-family:Arial,sans-serif;background:linear-gradient(180deg,#111827,#4338ca);padding:30px;">
<div style="max-width:720px;margin:60px auto;background:white;border-radius:24px;padding:36px;text-align:center;box-shadow:0 24px 70px rgba(0,0,0,0.35);">
<div style="width:54px;height:54px;border-radius:999px;background:#16a34a;color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;margin:0 auto 18px;">✓</div>
<h1>Email verified successfully</h1>
<p style="color:#4b5563;line-height:1.6;">GuardianChain confirmed that the declared email address received and accessed the link associated with this digital proof.</p>
<div style="text-align:left;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:16px;padding:18px;margin:24px 0;">
<p><strong>Confirmed email:</strong> ${payload.email}</p>
<p><strong>Hash:</strong></p>
<p style="word-break:break-all;font-family:monospace;font-size:13px;">${payload.hash}</p>
</div>
<p style="color:#4b5563;line-height:1.6;">This confirmation works as an additional evidence layer to demonstrate possession of the declared email.</p>
<a href="${verifyUrl}" style="display:inline-block;margin-top:18px;background:#4338ca;color:white;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:800;">Verify proof</a>
</div>
</body>
</html>
`

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    return res.status(200).send(html)
  } catch (error) {
    console.error("[VERIFY EMAIL ERROR]", error)

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    return res.status(400).send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Invalid link</title>
</head>
<body style="margin:0;font-family:Arial,sans-serif;background:#111827;color:white;text-align:center;padding:40px;">
<div style="max-width:620px;margin:80px auto;background:white;color:#111827;border-radius:20px;padding:30px;">
<h1>Invalid or expired verification link</h1>
<p>This email verification link could not be confirmed.</p>
</div>
</body>
</html>
`)
  }
}