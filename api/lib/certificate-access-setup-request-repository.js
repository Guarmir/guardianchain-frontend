import {
  getDatabaseClient,
} from "./db.js"

function normalizeEvidenceKey(
  value,
) {
  const evidenceKey =
    String(value || "")
      .trim()
      .toUpperCase()
      .slice(0, 255)

  if (!evidenceKey) {
    throw new Error(
      "Evidence Key is required",
    )
  }

  return evidenceKey
}

export async function getCertificateSetupRequestTarget({
  evidenceKey,
}) {
  const normalizedEvidenceKey =
    normalizeEvidenceKey(
      evidenceKey,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        certificate.id
          AS certificate_id,

        certificate.evidence_key,

        customer.email,

        credential.status
          AS access_status

      FROM
        gc_certificates
          AS certificate

      INNER JOIN
        gc_customers
          AS customer
        ON customer.id =
          certificate.customer_id

      INNER JOIN
        gc_certificate_access_credentials
          AS credential
        ON credential.certificate_id =
          certificate.id

      WHERE
        certificate.evidence_key =
          ${normalizedEvidenceKey}

        AND certificate.status =
          'active'

        AND customer.status =
          'active'

        AND credential.status =
          'setup_required'

      LIMIT 1
    `

  if (!rows[0]) {
    return null
  }

  return {
    certificateId:
      rows[0]
        .certificate_id,

    evidenceKey:
      rows[0]
        .evidence_key,

    email:
      rows[0]
        .email,
  }
}