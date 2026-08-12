import generateCertificate from "./generate-certificate.js"

import {
  getDatabaseClient,
} from "./lib/db.js"

import {
  authorizeCertificateSession,
} from "./lib/certificate-access-service.js"

const COOKIE_NAME =
  "gc_certificate_access"

function getCookie(
  request,
  name,
) {
  const header =
    String(
      request.headers.cookie ||
        "",
    )

  for (
    const item of header.split(";")
  ) {
    const index =
      item.indexOf("=")

    if (index < 0) {
      continue
    }

    if (
      item
        .slice(
          0,
          index,
        )
        .trim() !==
      name
    ) {
      continue
    }

    try {
      return decodeURIComponent(
        item
          .slice(
            index + 1,
          )
          .trim(),
      )
    } catch {
      return item
        .slice(
          index + 1,
        )
        .trim()
    }
  }

  return ""
}

function resolveLanguage(
  evidenceKey,
  requestedLanguage,
) {
  if (
    requestedLanguage ===
      "pt" ||
    requestedLanguage ===
      "en"
  ) {
    return requestedLanguage
  }

  return String(
    evidenceKey || "",
  )
    .toUpperCase()
    .includes("-BR-")
    ? "pt"
    : "en"
}

async function getCertificateIssuedAt({
  evidenceKey,
}) {
  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        created_at

      FROM
        gc_certificates

      WHERE
        evidence_key =
          ${evidenceKey}

        AND status =
          'active'

      LIMIT 1
    `

  if (
    !rows[0]?.created_at
  ) {
    throw new Error(
      "Certificate issuance timestamp is not available",
    )
  }

  const issuedAt =
    new Date(
      rows[0]
        .created_at,
    )

  if (
    Number.isNaN(
      issuedAt.getTime(),
    )
  ) {
    throw new Error(
      "Certificate issuance timestamp is invalid",
    )
  }

  return issuedAt.toISOString()
}

export default async function handler(
  request,
  response,
) {
  if (
    request.method !==
      "GET"
  ) {
    response.setHeader(
      "Allow",
      "GET",
    )

    return response
      .status(405)
      .json({
        error:
          "Method not allowed",
      })
  }

  response.setHeader(
    "Cache-Control",
    "private, no-store, max-age=0",
  )

  response.setHeader(
    "Pragma",
    "no-cache",
  )

  response.setHeader(
    "Expires",
    "0",
  )

  try {
    const evidenceKey =
      String(
        request.query
          .evidenceKey ||
          "",
      )
        .trim()
        .toUpperCase()

    if (!evidenceKey) {
      return response
        .status(400)
        .json({
          error:
            "Evidence Key is required",
        })
    }

    const sessionToken =
      getCookie(
        request,
        COOKIE_NAME,
      )

    if (!sessionToken) {
      return response
        .status(401)
        .json({
          error:
            "Certificate access authentication is required",
        })
    }

    const certificate =
      await authorizeCertificateSession({
        evidenceKey,
        sessionToken,
      })

    if (!certificate) {
      return response
        .status(401)
        .json({
          error:
            "Certificate access session is invalid or expired",
        })
    }

    const issuedAt =
      await getCertificateIssuedAt({
        evidenceKey:
          certificate.evidenceKey,
      })

    const language =
      resolveLanguage(
        certificate.evidenceKey,
        request.query.lang,
      )

    const pdf =
      await generateCertificate({
        hash:
          certificate.fileHash,

        language,

        fileName:
          certificate.fileName,

        ownerName:
          certificate.ownerName,

        ownerEmail:
          certificate.ownerEmail,

        ownerType:
          certificate.ownerType,

        paymentId:
          certificate.paymentId,

        evidenceKey:
          certificate.evidenceKey,

        issuedAt,
      })

    const viewMode =
      request.query.mode ===
      "view"

    response.setHeader(
      "Content-Type",
      "application/pdf",
    )

    response.setHeader(
      "Content-Disposition",
      `${
        viewMode
          ? "inline"
          : "attachment"
      }; filename="guardianchain-certificate.pdf"`,
    )

    response.setHeader(
      "X-Content-Type-Options",
      "nosniff",
    )

    return response.send(
      pdf,
    )
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS DOWNLOAD] Error:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    return response
      .status(500)
      .json({
        error:
          "Protected certificate access failed",
      })
  }
}