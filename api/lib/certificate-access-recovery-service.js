import nodemailer from "nodemailer"

import {
  CERTIFICATE_RECOVERY_TOKEN_TTL_MS,
  generateOpaqueAccessToken,
  generateRecoveryCode,
  hashCertificateAccessKey,
  hashOpaqueAccessToken,
  hashRecoveryCode,
  verifyRecoveryCode,
} from "./certificate-access-crypto.js"

import {
  completeCertificateRecovery,
  createCertificateRecoveryToken,
  getCertificateRecoveryState,
  getCertificateRecoveryTarget,
  recordCertificateRecoveryFailure,
} from "./certificate-access-recovery-repository.js"

function createRecoveryError(
  code,
  message,
) {
  const error =
    new Error(message)

  error.code = code

  return error
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

function getBaseUrl() {
  return String(
    process.env.BASE_URL ||
      process.env.PUBLIC_BASE_URL ||
      "https://www.guardianchain.online",
  )
    .trim()
    .replace(/\/+$/, "")
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

async function sendRecoveryLinkEmail({
  email,
  evidenceKey,
  recoveryUrl,
}) {
  const lang =
    resolveLanguage(
      evidenceKey,
    )

  const transporter =
    createTransporter()

  const subject =
    lang === "pt"
      ? "Recuperação de acesso — GuardianChain"
      : "Access recovery — GuardianChain"

  const text =
    lang === "pt"
      ? `Foi solicitada uma recuperação da Chave de Acesso do certificado GuardianChain.

Evidence Key™: ${evidenceKey}

Use o link abaixo para continuar:
${recoveryUrl}

O link expira em 30 minutos.

Além deste link, será necessário informar o Código de Recuperação criado quando a proteção do certificado foi configurada.

Se você não solicitou esta recuperação, ignore este e-mail. Sua Chave de Acesso atual continuará válida.`
      : `A GuardianChain certificate Access Key recovery was requested.

Evidence Key™: ${evidenceKey}

Use the link below to continue:
${recoveryUrl}

The link expires in 30 minutes.

In addition to this link, you must provide the Recovery Code created when certificate protection was configured.

If you did not request this recovery, ignore this email. Your current Access Key will remain valid.`

  const html =
    lang === "pt"
      ? `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <h2>Recuperação da Chave de Acesso</h2>

          <p>
            Foi solicitada uma recuperação da Chave de Acesso
            de um certificado GuardianChain.
          </p>

          <p>
            <strong>Evidence Key™:</strong>
            ${evidenceKey}
          </p>

          <p>
            <a
              href="${recoveryUrl}"
              style="display:inline-block;background:#4338ca;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;"
            >
              Recuperar acesso
            </a>
          </p>

          <p>
            Este link expira em <strong>30 minutos</strong>.
          </p>

          <p>
            Você também precisará informar seu
            <strong>Código de Recuperação</strong>.
          </p>

          <p style="font-size:13px;color:#6b7280;">
            Se você não solicitou esta recuperação, ignore este e-mail.
            Sua Chave de Acesso atual continuará válida.
          </p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
          <h2>Access Key recovery</h2>

          <p>
            A GuardianChain certificate Access Key recovery
            was requested.
          </p>

          <p>
            <strong>Evidence Key™:</strong>
            ${evidenceKey}
          </p>

          <p>
            <a
              href="${recoveryUrl}"
              style="display:inline-block;background:#4338ca;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;"
            >
              Recover access
            </a>
          </p>

          <p>
            This link expires in <strong>30 minutes</strong>.
          </p>

          <p>
            You will also need your
            <strong>Recovery Code</strong>.
          </p>

          <p style="font-size:13px;color:#6b7280;">
            If you did not request this recovery, ignore this email.
            Your current Access Key will remain valid.
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

async function sendRecoveryCompletedEmail({
  email,
  evidenceKey,
}) {
  const lang =
    resolveLanguage(
      evidenceKey,
    )

  const transporter =
    createTransporter()

  const subject =
    lang === "pt"
      ? "Sua Chave de Acesso foi alterada — GuardianChain"
      : "Your Access Key was changed — GuardianChain"

  const text =
    lang === "pt"
      ? `A Chave de Acesso do certificado ${evidenceKey} foi alterada com sucesso.

As sessões de acesso anteriores foram invalidadas.

Se você não realizou esta alteração, entre em contato com o suporte GuardianChain imediatamente.`
      : `The Access Key for certificate ${evidenceKey} was successfully changed.

Previous access sessions were invalidated.

If you did not make this change, contact GuardianChain support immediately.`

  await transporter.sendMail({
    from:
      `"GuardianChain" <${process.env.SMTP_USER}>`,

    to:
      String(email)
        .trim(),

    subject,
    text,
  })
}

export async function requestCertificateAccessRecovery({
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
    throw createRecoveryError(
      "INVALID_REQUEST",
      "Evidence Key is required",
    )
  }

  const target =
    await getCertificateRecoveryTarget({
      evidenceKey:
        normalizedEvidenceKey,
    })

  /*
   * Do not reveal whether a certificate exists.
   */
  if (!target) {
    return {
      requested:
        true,

      deliveryAttempted:
        false,
    }
  }

  const token =
    generateOpaqueAccessToken()

  const tokenHash =
    hashOpaqueAccessToken(
      token,
    )

  const expiresAt =
    new Date(
      Date.now() +
        CERTIFICATE_RECOVERY_TOKEN_TTL_MS,
    ).toISOString()

  await createCertificateRecoveryToken({
    certificateId:
      target.certificateId,

    tokenHash,
    expiresAt,
  })

  const lang =
    resolveLanguage(
      target.evidenceKey,
    )

  const recoveryUrl =
    `${getBaseUrl()}/certificate-access/recover?lang=${lang}&token=${encodeURIComponent(
      token,
    )}`

  await sendRecoveryLinkEmail({
    email:
      target.email,

    evidenceKey:
      target.evidenceKey,

    recoveryUrl,
  })

  return {
    requested:
      true,

    deliveryAttempted:
      true,
  }
}

export async function recoverCertificateAccess({
  recoveryToken,
  recoveryCode,
  newAccessKey,
  userAgent = null,
}) {
  const normalizedToken =
    String(
      recoveryToken || "",
    ).trim()

  if (
    !normalizedToken ||
    !recoveryCode ||
    !newAccessKey
  ) {
    throw createRecoveryError(
      "INVALID_REQUEST",
      "Recovery token, Recovery Code and new Access Key are required",
    )
  }

  const tokenHash =
    hashOpaqueAccessToken(
      normalizedToken,
    )

  const state =
    await getCertificateRecoveryState({
      tokenHash,
    })

  if (
    !state ||
    state.usedAt ||
    state.revokedAt ||
    !state.expiresAt ||
    new Date(
      state.expiresAt,
    ).getTime() <=
      Date.now() ||
    state.accessStatus !==
      "active" ||
    state.certificateStatus !==
      "active" ||
    state.customerStatus !==
      "active"
  ) {
    throw createRecoveryError(
      "INVALID_RECOVERY",
      "Recovery could not be validated",
    )
  }

  const validRecoveryCode =
    verifyRecoveryCode({
      recoveryCode,

      recoveryCodeHash:
        state.recoveryCodeHash,
    })

  if (!validRecoveryCode) {
    const failure =
      await recordCertificateRecoveryFailure({
        tokenId:
          state.tokenId,

        certificateId:
          state.certificateId,

        userAgent,
      })

    if (failure.revoked) {
      throw createRecoveryError(
        "RECOVERY_BLOCKED",
        "Recovery token was blocked after repeated failed attempts",
      )
    }

    throw createRecoveryError(
      "INVALID_RECOVERY",
      "Recovery could not be validated",
    )
  }

  const protectedAccessKey =
    await hashCertificateAccessKey(
      newAccessKey,
    )

  const newRecoveryCode =
    generateRecoveryCode()

  const newRecoveryCodeHash =
    hashRecoveryCode(
      newRecoveryCode,
    )

  const certificate =
    await completeCertificateRecovery({
      tokenHash,

      keyHash:
        protectedAccessKey
          .keyHash,

      keySalt:
        protectedAccessKey
          .keySalt,

      keyAlgorithm:
        protectedAccessKey
          .keyAlgorithm,

      recoveryCodeHash:
        newRecoveryCodeHash,

      userAgent,
    })

  /*
   * The recovery is already complete at this point.
   * Notification failure must not roll back the new key.
   */
  try {
    await sendRecoveryCompletedEmail({
      email:
        certificate.email,

      evidenceKey:
        certificate
          .evidenceKey,
    })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS RECOVERY] Security notification email failed:",
      {
        message:
          error?.message,
      },
    )
  }

  return {
    certificate,
    recoveryCode:
      newRecoveryCode,
  }
}