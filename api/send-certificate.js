import nodemailer from "nodemailer"
import crypto from "crypto"
import generateCertificate from "./generate-certificate.js"

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

function signToken(payload, secret) {
  const encodedPayload = base64UrlEncode(payload)

  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url")

  return `${encodedPayload}.${signature}`
}

export default async function sendEmail({
  hash,
  language,
  email,
  fileName = "",
  ownerName = "",
  ownerEmail = "",
  ownerType = "individual",
  paymentId = "",
}) {
  if (!email) {
    throw new Error("Recipient email is not defined")
  }

  if (!hash) {
    throw new Error("Hash is not defined")
  }

  if (!process.env.SMTP_HOST) {
    throw new Error("SMTP_HOST is not defined")
  }

  if (!process.env.SMTP_PORT) {
    throw new Error("SMTP_PORT is not defined")
  }

  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined")
  }

  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not defined")
  }

  const lang = language === "pt" ? "pt" : "en"
  const smtpPort = Number(process.env.SMTP_PORT)
  const secure = smtpPort === 465

  const baseUrl =
    process.env.PUBLIC_BASE_URL || "https://guardianchain.online"

  const verificationSecret =
    process.env.EMAIL_VERIFICATION_SECRET || process.env.SMTP_PASS

  const now = Date.now()

  const tokenPayload = {
    hash,
    email: String(email).trim().toLowerCase(),
    lang,
    iat: now,
    exp: now + 1000 * 60 * 60 * 24 * 30,
  }

  const emailVerificationToken = signToken(
    tokenPayload,
    verificationSecret
  )

  const emailVerificationUrl = `${baseUrl}/api/verify-email?token=${encodeURIComponent(
    emailVerificationToken
  )}`

  console.log("[SEND CERTIFICATE] Preparing email:", {
    email,
    hash,
    language: lang,
    fileName,
  })

  const pdfBuffer = await generateCertificate({
    hash,
    language: lang,
    fileName,
    ownerName,
    ownerEmail: ownerEmail || email,
    ownerType,
    paymentId,
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const subject =
    lang === "pt"
      ? "Seu certificado GuardianChain"
      : "Your GuardianChain certificate"

  const text =
    lang === "pt"
      ? `Seu certificado digital está anexado.

Para reforçar a evidência de posse deste e-mail, confirme o recebimento acessando o link abaixo:

${emailVerificationUrl}

Esse link ajuda a demonstrar que o endereço de e-mail declarado recebeu o certificado GuardianChain.`
      : `Your digital certificate is attached.

To strengthen the evidence of email ownership, confirm receipt using the link below:

${emailVerificationUrl}

This link helps demonstrate that the declared email address received the GuardianChain certificate.`

  const html =
    lang === "pt"
      ? `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Seu certificado GuardianChain está anexado</h2>
          <p>Seu certificado digital foi gerado com sucesso.</p>
          <p>Para reforçar a evidência de posse deste e-mail, confirme o recebimento clicando no botão abaixo:</p>
          <p>
            <a href="${emailVerificationUrl}" style="display:inline-block;background:#4338ca;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
              Confirmar meu e-mail
            </a>
          </p>
          <p style="font-size:13px;color:#4b5563;">
            Esse link ajuda a demonstrar que o endereço de e-mail declarado recebeu o certificado GuardianChain.
          </p>
          <p style="font-size:12px;color:#6b7280;">
            O GuardianChain nunca armazena seu arquivo original. Apenas o hash criptográfico é registrado.
          </p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Your GuardianChain certificate is attached</h2>
          <p>Your digital certificate was generated successfully.</p>
          <p>To strengthen the evidence of email ownership, confirm receipt by clicking the button below:</p>
          <p>
            <a href="${emailVerificationUrl}" style="display:inline-block;background:#4338ca;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">
              Confirm my email
            </a>
          </p>
          <p style="font-size:13px;color:#4b5563;">
            This link helps demonstrate that the declared email address received the GuardianChain certificate.
          </p>
          <p style="font-size:12px;color:#6b7280;">
            GuardianChain never stores your original file. Only the cryptographic hash is registered.
          </p>
        </div>
      `

  await transporter.verify()

  await transporter.sendMail({
    from: `"GuardianChain" <${process.env.SMTP_USER}>`,
    to: String(email).trim(),
    subject,
    text,
    html,
    attachments: [
      {
        filename: "guardianchain-certificate.pdf",
        content: pdfBuffer,
      },
    ],
  })

  console.log("[SEND CERTIFICATE] Email sent successfully to:", email)
}