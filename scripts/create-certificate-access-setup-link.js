import {
  getDatabaseClient,
} from "../api/lib/db.js"

import {
  issueCertificateSetupToken,
} from "../api/lib/certificate-access-service.js"

function getEnvironmentLabel() {
  return String(
    process.env
      .GUARDIANCHAIN_DATABASE_LABEL ||
      "",
  ).trim()
}

function resolveLanguage(
  evidenceKey,
) {
  const normalizedEvidenceKey =
    String(
      evidenceKey || "",
    ).toUpperCase()

  if (
    normalizedEvidenceKey.includes(
      "-BR-",
    )
  ) {
    return "pt"
  }

  return "en"
}

async function findCertificate() {
  const sql =
    getDatabaseClient()

  const requestedCertificateId =
    String(
      process.argv[2] || "",
    ).trim()

  if (
    requestedCertificateId
  ) {
    const rows =
      await sql`
        SELECT
          certificate.id,
          certificate.evidence_key,
          certificate.file_name,
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
          certificate.id =
            ${requestedCertificateId}::UUID

          AND certificate.status =
            'active'

          AND credential.status =
            'setup_required'

        LIMIT 1
      `

    return rows[0] || null
  }

  const rows =
    await sql`
      SELECT
        certificate.id,
        certificate.evidence_key,
        certificate.file_name,
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
        certificate.status =
          'active'

        AND credential.status =
          'setup_required'

      ORDER BY
        certificate.created_at DESC

      LIMIT 1
    `

  return rows[0] || null
}

async function run() {
  const environmentLabel =
    getEnvironmentLabel()

  if (
    environmentLabel !==
      "guardianchain-dev"
  ) {
    throw new Error(
      "This development helper can only run against guardianchain-dev",
    )
  }

  const certificate =
    await findCertificate()

  if (!certificate) {
    throw new Error(
      "No active certificate requiring access setup was found in DEV",
    )
  }

  const setup =
    await issueCertificateSetupToken({
      certificateId:
        certificate.id,
    })

  const lang =
    resolveLanguage(
      certificate
        .evidence_key,
    )

  const setupUrl =
    [
      "http://localhost:3000",
      "/certificate-access/setup",
      `?lang=${lang}`,
      `&token=${encodeURIComponent(
        setup.token,
      )}`,
    ].join("")

  console.log(
    "\n[CERTIFICATE ACCESS DEV]",
  )

  console.log({
    environment:
      environmentLabel,

    certificateId:
      certificate.id,

    evidenceKey:
      certificate
        .evidence_key,

    fileName:
      certificate
        .file_name ||
      null,

    accessStatus:
      certificate
        .access_status,

    expiresAt:
      setup.expiresAt,
  })

  console.log(
    "\nOpen this DEV-only setup URL:\n",
  )

  console.log(
    setupUrl,
  )

  console.log(
    "\nDo not share this URL. The token grants one-time access to configure the certificate.\n",
  )
}

run().catch(
  (error) => {
    console.error(
      "[CERTIFICATE ACCESS DEV] Failed:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    process.exitCode = 1
  },
)