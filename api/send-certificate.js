import nodemailer from "nodemailer"
import crypto from "crypto"

import {
  getDatabaseClient,
} from "./lib/db.js"

import {
  generateEvidenceKey,
} from "./lib/evidence-key.js"

import {
  issueCertificateSetupToken,
} from "./lib/certificate-access-service.js"

function base64UrlEncode(
  value,
) {
  return Buffer.from(
    JSON.stringify(value),
  ).toString("base64url")
}

function signToken(
  payload,
  secret,
) {
  const encodedPayload =
    base64UrlEncode(payload)

  const signature =
    crypto
      .createHmac(
        "sha256",
        secret,
      )
      .update(
        encodedPayload,
      )
      .digest(
        "base64url",
      )

  return `${encodedPayload}.${signature}`
}

function getBaseUrl() {
  return String(
    process.env.BASE_URL ||
      process.env.PUBLIC_BASE_URL ||
      "https://www.guardianchain.online",
  )
    .trim()
    .replace(/\/+$/, "")
}

async function findCertificateForAccessSetup({
  evidenceKey,
  hash,
}) {
  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        certificate.id,

        certificate.evidence_key,

        credential.status
          AS access_status

      FROM
        gc_certificates
          AS certificate

      INNER JOIN
        gc_certificate_access_credentials
          AS credential
        ON credential.certificate_id =
          certificate.id

      WHERE
        certificate.evidence_key =
          ${evidenceKey}

        AND certificate.file_hash =
          ${hash}

        AND certificate.status =
          'active'

        AND credential.status =
          'setup_required'

      LIMIT 1
    `

  if (!rows[0]) {
    throw new Error(
      "Certificate access setup is not available",
    )
  }

  return {
    id:
      rows[0].id,

    evidenceKey:
      rows[0]
        .evidence_key,
  }
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
  issuedAt = null,
  evidenceKey:
    providedEvidenceKey = "",
}) {
  if (!email) {
    throw new Error(
      "Recipient email is not defined",
    )
  }

  if (!hash) {
    throw new Error(
      "Hash is not defined",
    )
  }

  if (
    !process.env.SMTP_HOST
  ) {
    throw new Error(
      "SMTP_HOST is not defined",
    )
  }

  if (
    !process.env.SMTP_PORT
  ) {
    throw new Error(
      "SMTP_PORT is not defined",
    )
  }

  if (
    !process.env.SMTP_USER
  ) {
    throw new Error(
      "SMTP_USER is not defined",
    )
  }

  if (
    !process.env.SMTP_PASS
  ) {
    throw new Error(
      "SMTP_PASS is not defined",
    )
  }

  const lang =
    language === "pt"
      ? "pt"
      : "en"

  const smtpPort =
    Number(
      process.env.SMTP_PORT,
    )

  const secure =
    smtpPort === 465

  const baseUrl =
    getBaseUrl()

  const verificationSecret =
    process.env
      .EMAIL_VERIFICATION_SECRET ||
    process.env.SMTP_PASS

  const evidenceKey =
    String(
      providedEvidenceKey || "",
    ).trim() ||
    generateEvidenceKey({
      paymentId:
        paymentId ||
        `HASH-${hash}`,

      fileHash:
        hash,

      language:
        lang,

      issuedAt,
    })

  /*
   * Locate the certificate already persisted by the
   * fulfillment flow. The raw setup token is never
   * stored in the database.
   */
  const certificate =
    await findCertificateForAccessSetup({
      evidenceKey,
      hash,
    })

  const accessSetup =
    await issueCertificateSetupToken({
      certificateId:
        certificate.id,
    })

  const setupUrl =
    `${baseUrl}/certificate-access/setup?lang=${lang}&token=${encodeURIComponent(
      accessSetup.token,
    )}`

  const now =
    Date.now()

  const tokenPayload = {
    hash,

    email:
      String(email)
        .trim()
        .toLowerCase(),

    lang,

    iat:
      now,

    exp:
      now +
      1000 *
        60 *
        60 *
        24 *
        30,
  }

  const emailVerificationToken =
    signToken(
      tokenPayload,
      verificationSecret,
    )

  const emailVerificationUrl =
    `${baseUrl}/api/verify-email?token=${encodeURIComponent(
      emailVerificationToken,
    )}`

  console.log(
    "[SEND CERTIFICATE] Preparing protected delivery:",
    {
      email:
        String(email)
          .trim(),

      hash,

      language:
        lang,

      fileName,

      paymentId,

      evidenceKey,

      certificateId:
        certificate.id,

      setupExpiresAt:
        accessSetup.expiresAt,
    },
  )

  const transporter =
    nodemailer
      .createTransport({
        host:
          process.env
            .SMTP_HOST,

        port:
          smtpPort,

        secure,

        auth: {
          user:
            process.env
              .SMTP_USER,

          pass:
            process.env
              .SMTP_PASS,
        },
      })

  const subject =
    lang === "pt"
      ? "Seu certificado GuardianChain está pronto"
      : "Your GuardianChain certificate is ready"

  const text =
    lang === "pt"
      ? `Seu certificado GuardianChain foi criado com sucesso.

Evidence Key™: ${evidenceKey}

Por segurança, o certificado não está anexado a este e-mail.

Antes de visualizar ou baixar seu certificado, crie sua Chave de Acesso privada utilizando o link abaixo:

${setupUrl}

O link de configuração é temporário e de uso único.

Após criar sua Chave de Acesso, você receberá também um Código de Recuperação. Guarde esse código em um local seguro e separado da sua chave.

Para reforçar a evidência de posse deste e-mail, você também pode confirmar seu endereço:

${emailVerificationUrl}

A GuardianChain nunca armazena seu arquivo original.`
      : `Your GuardianChain certificate was created successfully.

Evidence Key™: ${evidenceKey}

For security, the certificate is not attached to this email.

Before viewing or downloading your certificate, create your private Access Key using the link below:

${setupUrl}

The setup link is temporary and can only be used once.

After creating your Access Key, you will also receive a Recovery Code. Store this code somewhere secure and separate from your key.

To strengthen evidence of ownership of this email address, you may also confirm your email:

${emailVerificationUrl}

GuardianChain never stores your original file.`

  const html =
    lang === "pt"
      ? `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#111827;max-width:620px;margin:auto;">
          <h2 style="color:#1f2a6d;">
            Seu certificado GuardianChain está pronto
          </h2>

          <p>
            Seu registro foi criado com sucesso.
          </p>

          <div style="margin:18px 0;padding:15px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;">
            <strong>Evidence Key™</strong>

            <div style="margin-top:7px;font-family:monospace;font-size:15px;color:#1f2a6d;overflow-wrap:anywhere;">
              ${evidenceKey}
            </div>
          </div>

          <div style="margin:18px 0;padding:15px;background:#f9fafb;border-radius:10px;">
            <strong>🔐 Certificado protegido</strong>

            <p style="margin-bottom:0;">
              Por segurança, o PDF não é enviado como anexo.
              Primeiro crie sua Chave de Acesso privada.
            </p>
          </div>

          <p style="text-align:center;margin:26px 0;">
            <a
              href="${setupUrl}"
              style="display:inline-block;background:#4338ca;color:#ffffff;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold;"
            >
              Criar minha Chave de Acesso
            </a>
          </p>

          <p style="font-size:13px;color:#4b5563;">
            Este link de configuração é temporário e de uso único.
            Depois da configuração, você receberá um Código de Recuperação
            que deverá ser guardado em local seguro.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

          <p>
            Para reforçar a evidência de posse deste endereço de e-mail:
          </p>

          <p>
            <a
              href="${emailVerificationUrl}"
              style="color:#4338ca;font-weight:bold;"
            >
              Confirmar meu e-mail
            </a>
          </p>

          <p style="font-size:12px;color:#6b7280;">
            A GuardianChain nunca armazena seu arquivo original.
            Apenas a impressão digital criptográfica e os dados necessários
            à evidência são registrados.
          </p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#111827;max-width:620px;margin:auto;">
          <h2 style="color:#1f2a6d;">
            Your GuardianChain certificate is ready
          </h2>

          <p>
            Your record was created successfully.
          </p>

          <div style="margin:18px 0;padding:15px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;">
            <strong>Evidence Key™</strong>

            <div style="margin-top:7px;font-family:monospace;font-size:15px;color:#1f2a6d;overflow-wrap:anywhere;">
              ${evidenceKey}
            </div>
          </div>

          <div style="margin:18px 0;padding:15px;background:#f9fafb;border-radius:10px;">
            <strong>🔐 Protected certificate</strong>

            <p style="margin-bottom:0;">
              For security, the PDF is not sent as an attachment.
              First create your private Access Key.
            </p>
          </div>

          <p style="text-align:center;margin:26px 0;">
            <a
              href="${setupUrl}"
              style="display:inline-block;background:#4338ca;color:#ffffff;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold;"
            >
              Create my Access Key
            </a>
          </p>

          <p style="font-size:13px;color:#4b5563;">
            This setup link is temporary and can only be used once.
            After setup, you will receive a Recovery Code that should
            be stored somewhere secure.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />

          <p>
            To strengthen evidence of ownership of this email address:
          </p>

          <p>
            <a
              href="${emailVerificationUrl}"
              style="color:#4338ca;font-weight:bold;"
            >
              Confirm my email
            </a>
          </p>

          <p style="font-size:12px;color:#6b7280;">
            GuardianChain never stores your original file.
            Only the cryptographic fingerprint and evidence-related
            data are recorded.
          </p>
        </div>
      `

  await transporter.verify()

  await transporter.sendMail({
    from:
      `"GuardianChain" <${process.env.SMTP_USER}>`,

    to:
      String(email)
        .trim(),

    subject,
    text,
    html,
  })

  console.log(
    "[SEND CERTIFICATE] Protected delivery email sent successfully:",
    {
      email:
        String(email)
          .trim(),

      evidenceKey,

      certificateId:
        certificate.id,
    },
  )

  return {
    evidenceKey,

    certificateId:
      certificate.id,

    setupExpiresAt:
      accessSetup.expiresAt,
  }
}