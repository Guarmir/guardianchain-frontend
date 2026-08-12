import nodemailer from "nodemailer"

import {
  issueCertificateSetupToken,
} from "./certificate-access-service.js"

import {
  getCertificateSetupRequestTarget,
} from "./certificate-access-setup-request-repository.js"

function getBaseUrl() {
  return String(
    process.env.BASE_URL ||
      process.env.PUBLIC_BASE_URL ||
      "https://www.guardianchain.online",
  )
    .trim()
    .replace(/\/+$/, "")
}

function resolveLanguage(
  evidenceKey,
) {
  return String(
    evidenceKey || "",
  )
    .toUpperCase()
    .includes("-BR-")
    ? "pt"
    : "en"
}

function createTransporter() {
  const host =
    String(
      process.env.SMTP_HOST ||
        "",
    ).trim()

  const port =
    Number(
      process.env.SMTP_PORT,
    )

  const user =
    String(
      process.env.SMTP_USER ||
        "",
    ).trim()

  const pass =
    String(
      process.env.SMTP_PASS ||
        "",
    )

  if (
    !host ||
    !Number.isFinite(port) ||
    !user ||
    !pass
  ) {
    throw new Error(
      "SMTP configuration is incomplete",
    )
  }

  return nodemailer.createTransport({
    host,

    port,

    secure:
      port === 465,

    auth: {
      user,
      pass,
    },
  })
}

async function sendSetupLink({
  email,
  evidenceKey,
  setupUrl,
}) {
  const lang =
    resolveLanguage(
      evidenceKey,
    )

  const transporter =
    createTransporter()

  const subject =
    lang === "pt"
      ? "Novo link de proteção — GuardianChain"
      : "New protection setup link — GuardianChain"

  const text =
    lang === "pt"
      ? `Um novo link para configurar a proteção do seu certificado GuardianChain foi solicitado.

Evidence Key™: ${evidenceKey}

Crie sua Chave de Acesso usando o link abaixo:

${setupUrl}

Este link é temporário e de uso único.

Se você não solicitou este link, ignore esta mensagem.`
      : `A new link to configure protection for your GuardianChain certificate was requested.

Evidence Key™: ${evidenceKey}

Create your Access Key using the link below:

${setupUrl}

This link is temporary and can only be used once.

If you did not request this link, ignore this message.`

  const html =
    lang === "pt"
      ? `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#111827;max-width:620px;margin:auto;">
          <h2 style="color:#1f2a6d;">
            Novo link de proteção
          </h2>

          <p>
            Foi solicitado um novo link para configurar
            a proteção do seu certificado GuardianChain.
          </p>

          <div style="margin:18px 0;padding:15px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;">
            <strong>Evidence Key™</strong>

            <div style="margin-top:7px;font-family:monospace;color:#1f2a6d;overflow-wrap:anywhere;">
              ${evidenceKey}
            </div>
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
            Este link é temporário e de uso único.
            A emissão de um novo link invalida qualquer
            link anterior ainda não utilizado.
          </p>

          <p style="font-size:12px;color:#6b7280;">
            Se você não solicitou este link,
            ignore esta mensagem.
          </p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#111827;max-width:620px;margin:auto;">
          <h2 style="color:#1f2a6d;">
            New protection setup link
          </h2>

          <p>
            A new link was requested to configure
            protection for your GuardianChain certificate.
          </p>

          <div style="margin:18px 0;padding:15px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;">
            <strong>Evidence Key™</strong>

            <div style="margin-top:7px;font-family:monospace;color:#1f2a6d;overflow-wrap:anywhere;">
              ${evidenceKey}
            </div>
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
            This link is temporary and can only be used once.
            Creating a new link invalidates any previous
            unused setup link.
          </p>

          <p style="font-size:12px;color:#6b7280;">
            If you did not request this link,
            ignore this message.
          </p>
        </div>
      `

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
}

export async function requestCertificateAccessSetup({
  evidenceKey,
}) {
  const normalizedEvidenceKey =
    String(
      evidenceKey || "",
    )
      .trim()
      .toUpperCase()

  if (
    !normalizedEvidenceKey
  ) {
    throw new Error(
      "Evidence Key is required",
    )
  }

  const target =
    await getCertificateSetupRequestTarget({
      evidenceKey:
        normalizedEvidenceKey,
    })

  /*
   * Never reveal whether a certificate exists
   * or whether setup is still required.
   */
  if (!target) {
    return {
      requested:
        true,

      deliveryAttempted:
        false,
    }
  }

  const setup =
    await issueCertificateSetupToken({
      certificateId:
        target.certificateId,
    })

  const lang =
    resolveLanguage(
      target.evidenceKey,
    )

  const setupUrl =
    `${getBaseUrl()}/certificate-access/setup?lang=${lang}&token=${encodeURIComponent(
      setup.token,
    )}`

  await sendSetupLink({
    email:
      target.email,

    evidenceKey:
      target.evidenceKey,

    setupUrl,
  })

  return {
    requested:
      true,

    deliveryAttempted:
      true,
  }
}