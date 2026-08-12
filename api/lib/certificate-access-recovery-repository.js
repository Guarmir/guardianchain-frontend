import {
  getDatabaseClient,
} from "./db.js"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const HASH_PATTERN =
  /^[0-9a-f]{64}$/

const MAX_RECOVERY_ATTEMPTS = 5

function normalizeCertificateId(
  value,
) {
  const normalized =
    String(value || "")
      .trim()

  if (
    !UUID_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "A valid certificateId is required",
    )
  }

  return normalized
}

function normalizeEvidenceKey(
  value,
) {
  const normalized =
    String(value || "")
      .trim()
      .toUpperCase()
      .slice(0, 255)

  if (!normalized) {
    throw new Error(
      "Evidence Key is required",
    )
  }

  return normalized
}

function normalizeHash(
  value,
  fieldName,
) {
  const normalized =
    String(value || "")
      .trim()
      .toLowerCase()

  if (
    !HASH_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      `A valid ${fieldName} is required`,
    )
  }

  return normalized
}

function normalizeRequiredText(
  value,
  fieldName,
  maximumLength = 500,
) {
  const normalized =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  if (!normalized) {
    throw new Error(
      `${fieldName} is required`,
    )
  }

  return normalized
}

function normalizeOptionalText(
  value,
  maximumLength = 1000,
) {
  const normalized =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  return normalized || null
}

function normalizeFutureDate(
  value,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    ) ||
    date.getTime() <=
      Date.now()
  ) {
    throw new Error(
      "A valid future expiration date is required",
    )
  }

  return date.toISOString()
}

function normalizeDate(
  value,
) {
  if (!value) {
    return null
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null
  }

  return date.toISOString()
}

export async function getCertificateRecoveryTarget({
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
          'active'

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
      rows[0].email,
  }
}

export async function createCertificateRecoveryToken({
  certificateId,
  tokenHash,
  expiresAt,
}) {
  const normalizedCertificateId =
    normalizeCertificateId(
      certificateId,
    )

  const normalizedTokenHash =
    normalizeHash(
      tokenHash,
      "tokenHash",
    )

  const normalizedExpiresAt =
    normalizeFutureDate(
      expiresAt,
    )

  const sql =
    getDatabaseClient()

  const [
    ,
    insertedRows,
  ] =
    await sql.transaction([
      sql`
        UPDATE
          gc_certificate_access_tokens

        SET
          revoked_at =
            COALESCE(
              revoked_at,
              NOW()
            )

        WHERE
          certificate_id =
            ${normalizedCertificateId}::UUID

          AND token_type =
            'recovery'

          AND used_at
            IS NULL

          AND revoked_at
            IS NULL
      `,

      sql`
        INSERT INTO
          gc_certificate_access_tokens (
            certificate_id,
            token_type,
            token_hash,
            expires_at
          )

        SELECT
          certificate.id,
          'recovery',
          ${normalizedTokenHash},
          ${normalizedExpiresAt}::TIMESTAMPTZ

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
          certificate.id =
            ${normalizedCertificateId}::UUID

          AND certificate.status =
            'active'

          AND customer.status =
            'active'

          AND credential.status =
            'active'

        RETURNING
          id,
          certificate_id,
          expires_at
      `,
    ])

  if (!insertedRows[0]) {
    throw new Error(
      "Certificate recovery is not available",
    )
  }

  return {
    id:
      insertedRows[0].id,

    certificateId:
      insertedRows[0]
        .certificate_id,

    expiresAt:
      normalizeDate(
        insertedRows[0]
          .expires_at,
      ),
  }
}

export async function getCertificateRecoveryState({
  tokenHash,
}) {
  const normalizedTokenHash =
    normalizeHash(
      tokenHash,
      "tokenHash",
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      SELECT
        token_record.id
          AS token_id,

        token_record
          .certificate_id,

        token_record
          .attempt_count,

        token_record
          .expires_at,

        token_record
          .used_at,

        token_record
          .revoked_at,

        credential
          .recovery_code_hash,

        credential.status
          AS access_status,

        certificate.status
          AS certificate_status,

        certificate
          .evidence_key,

        customer.status
          AS customer_status,

        customer.email

      FROM
        gc_certificate_access_tokens
          AS token_record

      INNER JOIN
        gc_certificate_access_credentials
          AS credential
        ON credential.certificate_id =
          token_record
            .certificate_id

      INNER JOIN
        gc_certificates
          AS certificate
        ON certificate.id =
          token_record
            .certificate_id

      INNER JOIN
        gc_customers
          AS customer
        ON customer.id =
          certificate.customer_id

      WHERE
        token_record.token_hash =
          ${normalizedTokenHash}

        AND token_record.token_type =
          'recovery'

      LIMIT 1
    `

  if (!rows[0]) {
    return null
  }

  return {
    tokenId:
      rows[0]
        .token_id,

    certificateId:
      rows[0]
        .certificate_id,

    evidenceKey:
      rows[0]
        .evidence_key,

    email:
      rows[0].email,

    attemptCount:
      Number(
        rows[0]
          .attempt_count ||
        0,
      ),

    expiresAt:
      normalizeDate(
        rows[0]
          .expires_at,
      ),

    usedAt:
      normalizeDate(
        rows[0]
          .used_at,
      ),

    revokedAt:
      normalizeDate(
        rows[0]
          .revoked_at,
      ),

    recoveryCodeHash:
      rows[0]
        .recovery_code_hash,

    accessStatus:
      rows[0]
        .access_status,

    certificateStatus:
      rows[0]
        .certificate_status,

    customerStatus:
      rows[0]
        .customer_status,
  }
}

export async function recordCertificateRecoveryFailure({
  tokenId,
  certificateId,
  userAgent = null,
}) {
  const normalizedTokenId =
    normalizeCertificateId(
      tokenId,
    )

  const normalizedCertificateId =
    normalizeCertificateId(
      certificateId,
    )

  const normalizedUserAgent =
    normalizeOptionalText(
      userAgent,
      1000,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      WITH updated_token AS (
        UPDATE
          gc_certificate_access_tokens

        SET
          attempt_count =
            attempt_count + 1,

          revoked_at =
            CASE
              WHEN
                attempt_count + 1 >=
                  ${MAX_RECOVERY_ATTEMPTS}
              THEN
                COALESCE(
                  revoked_at,
                  NOW()
                )
              ELSE
                revoked_at
            END

        WHERE
          id =
            ${normalizedTokenId}::UUID

          AND certificate_id =
            ${normalizedCertificateId}::UUID

          AND used_at
            IS NULL

          AND revoked_at
            IS NULL

        RETURNING
          certificate_id,
          attempt_count,
          revoked_at
      ),

      access_event AS (
        INSERT INTO
          gc_certificate_access_events (
            certificate_id,
            event_type,
            outcome,
            user_agent,
            metadata
          )

        SELECT
          certificate_id,

          'access_recovery',

          CASE
            WHEN revoked_at
              IS NOT NULL
            THEN 'blocked'
            ELSE 'failure'
          END,

          ${normalizedUserAgent},

          jsonb_build_object(
            'attemptCount',
            attempt_count
          )

        FROM
          updated_token

        RETURNING id
      )

      SELECT
        attempt_count,
        revoked_at

      FROM
        updated_token
    `

  return {
    attemptCount:
      Number(
        rows[0]
          ?.attempt_count ||
        0,
      ),

    revoked:
      Boolean(
        rows[0]
          ?.revoked_at,
      ),
  }
}

export async function completeCertificateRecovery({
  tokenHash,
  keyHash,
  keySalt,
  keyAlgorithm,
  recoveryCodeHash,
  userAgent = null,
}) {
  const normalizedTokenHash =
    normalizeHash(
      tokenHash,
      "tokenHash",
    )

  const normalizedKeyHash =
    normalizeRequiredText(
      keyHash,
      "keyHash",
      256,
    )

  const normalizedKeySalt =
    normalizeRequiredText(
      keySalt,
      "keySalt",
      256,
    )

  const normalizedKeyAlgorithm =
    normalizeRequiredText(
      keyAlgorithm,
      "keyAlgorithm",
      50,
    )

  const normalizedRecoveryCodeHash =
    normalizeHash(
      recoveryCodeHash,
      "recoveryCodeHash",
    )

  const normalizedUserAgent =
    normalizeOptionalText(
      userAgent,
      1000,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      WITH valid_token AS (
        SELECT
          token_record.id
            AS token_id,

          token_record
            .certificate_id

        FROM
          gc_certificate_access_tokens
            AS token_record

        INNER JOIN
          gc_certificate_access_credentials
            AS credential
          ON credential
              .certificate_id =
            token_record
              .certificate_id

        INNER JOIN
          gc_certificates
            AS certificate
          ON certificate.id =
            token_record
              .certificate_id

        INNER JOIN
          gc_customers
            AS customer
          ON customer.id =
            certificate.customer_id

        WHERE
          token_record.token_hash =
            ${normalizedTokenHash}

          AND token_record.token_type =
            'recovery'

          AND token_record.used_at
            IS NULL

          AND token_record.revoked_at
            IS NULL

          AND token_record.expires_at >
            NOW()

          AND token_record.attempt_count <
            ${MAX_RECOVERY_ATTEMPTS}

          AND credential.status =
            'active'

          AND certificate.status =
            'active'

          AND customer.status =
            'active'

        FOR UPDATE OF
          token_record,
          credential
      ),

      used_token AS (
        UPDATE
          gc_certificate_access_tokens
            AS token_record

        SET
          used_at =
            NOW()

        FROM
          valid_token

        WHERE
          token_record.id =
            valid_token.token_id

          AND token_record.used_at
            IS NULL

        RETURNING
          token_record
            .certificate_id
      ),

      updated_credential AS (
        UPDATE
          gc_certificate_access_credentials
            AS credential

        SET
          key_hash =
            ${normalizedKeyHash},

          key_salt =
            ${normalizedKeySalt},

          key_algorithm =
            ${normalizedKeyAlgorithm},

          recovery_code_hash =
            ${normalizedRecoveryCodeHash},

          access_version =
            access_version + 1,

          failed_attempts =
            0,

          locked_until =
            NULL,

          last_recovery_at =
            NOW(),

          updated_at =
            NOW()

        FROM
          used_token

        WHERE
          credential.certificate_id =
            used_token
              .certificate_id

        RETURNING
          credential
            .certificate_id,

          credential
            .access_version,

          credential
            .last_recovery_at
      ),

      revoked_sessions AS (
        UPDATE
          gc_certificate_access_sessions
            AS access_session

        SET
          revoked_at =
            COALESCE(
              revoked_at,
              NOW()
            )

        FROM
          updated_credential

        WHERE
          access_session
              .certificate_id =
            updated_credential
              .certificate_id

          AND access_session.revoked_at
            IS NULL

        RETURNING
          access_session.id
      ),

      revoked_tokens AS (
        UPDATE
          gc_certificate_access_tokens
            AS token_record

        SET
          revoked_at =
            COALESCE(
              revoked_at,
              NOW()
            )

        FROM
          updated_credential

        WHERE
          token_record.certificate_id =
            updated_credential
              .certificate_id

          AND token_record.used_at
            IS NULL

          AND token_record.revoked_at
            IS NULL

        RETURNING
          token_record.id
      ),

      access_event AS (
        INSERT INTO
          gc_certificate_access_events (
            certificate_id,
            event_type,
            outcome,
            user_agent,
            metadata
          )

        SELECT
          updated_credential
            .certificate_id,

          'access_key_recovered',

          'success',

          ${normalizedUserAgent},

          jsonb_build_object(
            'accessVersion',
            updated_credential
              .access_version
          )

        FROM
          updated_credential

        RETURNING id
      )

      SELECT
        updated_credential
          .certificate_id,

        updated_credential
          .access_version,

        updated_credential
          .last_recovery_at,

        certificate.evidence_key,

        customer.email

      FROM
        updated_credential

      INNER JOIN
        gc_certificates
          AS certificate
        ON certificate.id =
          updated_credential
            .certificate_id

      INNER JOIN
        gc_customers
          AS customer
        ON customer.id =
          certificate.customer_id
    `

  if (!rows[0]) {
    throw new Error(
      "Recovery token is invalid, expired, used, or revoked",
    )
  }

  return {
    certificateId:
      rows[0]
        .certificate_id,

    evidenceKey:
      rows[0]
        .evidence_key,

    email:
      rows[0].email,

    accessVersion:
      Number(
        rows[0]
          .access_version,
      ),

    recoveredAt:
      normalizeDate(
        rows[0]
          .last_recovery_at,
      ),
  }
}