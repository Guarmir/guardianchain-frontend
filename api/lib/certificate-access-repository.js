import {
  getDatabaseClient,
} from "./db.js"

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const TOKEN_HASH_PATTERN =
  /^[0-9a-f]{64}$/

const MAX_FAILED_ATTEMPTS = 5
const LOCK_MINUTES = 15

function normalizeCertificateId(
  value,
) {
  const certificateId =
    String(value || "")
      .trim()

  if (
    !UUID_PATTERN.test(
      certificateId,
    )
  ) {
    throw new Error(
      "A valid certificateId is required",
    )
  }

  return certificateId
}

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
      "evidenceKey is required",
    )
  }

  return evidenceKey
}

function normalizeTokenHash(
  value,
) {
  const tokenHash =
    String(value || "")
      .trim()
      .toLowerCase()

  if (
    !TOKEN_HASH_PATTERN.test(
      tokenHash,
    )
  ) {
    throw new Error(
      "A valid token hash is required",
    )
  }

  return tokenHash
}

function normalizeRecoveryCodeHash(
  value,
) {
  const recoveryCodeHash =
    String(value || "")
      .trim()
      .toLowerCase()

  if (
    !TOKEN_HASH_PATTERN.test(
      recoveryCodeHash,
    )
  ) {
    throw new Error(
      "A valid recovery code hash is required",
    )
  }

  return recoveryCodeHash
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

function normalizeAccessVersion(
  value,
) {
  const version =
    Number(value)

  if (
    !Number.isInteger(version) ||
    version <= 0
  ) {
    throw new Error(
      "A valid accessVersion is required",
    )
  }

  return version
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

export async function createCertificateSetupToken({
  certificateId,
  tokenHash,
  expiresAt,
}) {
  const normalizedCertificateId =
    normalizeCertificateId(
      certificateId,
    )

  const normalizedTokenHash =
    normalizeTokenHash(
      tokenHash,
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
            'setup'

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
          'setup',
          ${normalizedTokenHash},
          ${normalizedExpiresAt}::TIMESTAMPTZ

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
            ${normalizedCertificateId}::UUID

          AND certificate.status =
            'active'

          AND credential.status =
            'setup_required'

        RETURNING
          id,
          certificate_id,
          token_type,
          expires_at,
          created_at
      `,
    ])

  if (
    !insertedRows[0]
  ) {
    throw new Error(
      "Certificate access setup is not available",
    )
  }

  return {
    id:
      insertedRows[0].id,

    certificateId:
      insertedRows[0]
        .certificate_id,

    tokenType:
      insertedRows[0]
        .token_type,

    expiresAt:
      new Date(
        insertedRows[0]
          .expires_at,
      ).toISOString(),

    createdAt:
      new Date(
        insertedRows[0]
          .created_at,
      ).toISOString(),
  }
}

export async function activateCertificateAccess({
  tokenHash,
  keyHash,
  keySalt,
  keyAlgorithm,
  recoveryCodeHash,
  userAgent = null,
}) {
  const normalizedTokenHash =
    normalizeTokenHash(
      tokenHash,
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
    normalizeRecoveryCodeHash(
      recoveryCodeHash,
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
          gc_certificates
            AS certificate
          ON certificate.id =
            token_record
              .certificate_id

        INNER JOIN
          gc_certificate_access_credentials
            AS credential
          ON credential
              .certificate_id =
            certificate.id

        WHERE
          token_record.token_hash =
            ${normalizedTokenHash}

          AND token_record.token_type =
            'setup'

          AND token_record.used_at
            IS NULL

          AND token_record.revoked_at
            IS NULL

          AND token_record.expires_at >
            NOW()

          AND certificate.status =
            'active'

          AND credential.status =
            'setup_required'

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

        FROM valid_token

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

          status =
            'active',

          failed_attempts =
            0,

          locked_until =
            NULL,

          configured_at =
            COALESCE(
              configured_at,
              NOW()
            ),

          updated_at =
            NOW()

        FROM used_token

        WHERE
          credential.certificate_id =
            used_token
              .certificate_id

          AND credential.status =
            'setup_required'

        RETURNING
          credential
            .certificate_id,

          credential.status,

          credential.access_version,

          credential.configured_at
      ),

      revoked_setup_tokens AS (
        UPDATE
          gc_certificate_access_tokens
            AS token_record

        SET
          revoked_at =
            COALESCE(
              revoked_at,
              NOW()
            )

        FROM updated_credential

        WHERE
          token_record.certificate_id =
            updated_credential
              .certificate_id

          AND token_record.token_type =
            'setup'

          AND token_record.used_at
            IS NULL

          AND token_record.revoked_at
            IS NULL

        RETURNING
          token_record.id
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

        FROM updated_credential

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

          'access_key_configured',

          'success',

          ${normalizedUserAgent},

          jsonb_build_object(
            'accessVersion',
            updated_credential
              .access_version,

            'source',
            'initial_setup'
          )

        FROM updated_credential

        RETURNING id
      )

      SELECT
        updated_credential
          .certificate_id,

        updated_credential.status,

        updated_credential
          .access_version,

        updated_credential
          .configured_at,

        certificate.evidence_key,

        certificate.file_name

      FROM updated_credential

      INNER JOIN
        gc_certificates
          AS certificate
        ON certificate.id =
          updated_credential
            .certificate_id
    `

  if (
    !rows[0]
  ) {
    throw new Error(
      "The setup token is invalid, expired, already used, or revoked",
    )
  }

  return {
    certificateId:
      rows[0]
        .certificate_id,

    evidenceKey:
      rows[0]
        .evidence_key,

    fileName:
      rows[0]
        .file_name ||
      null,

    status:
      rows[0].status,

    accessVersion:
      Number(
        rows[0]
          .access_version,
      ),

    configuredAt:
      new Date(
        rows[0]
          .configured_at,
      ).toISOString(),
  }
}

export async function getCertificateAccessAuthenticationState({
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

        certificate.status
          AS certificate_status,

        customer.status
          AS customer_status,

        credential.status
          AS access_status,

        credential.key_hash,

        credential.key_salt,

        credential.key_algorithm,

        credential.access_version,

        credential.failed_attempts,

        credential.locked_until

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

    certificateStatus:
      rows[0]
        .certificate_status,

    customerStatus:
      rows[0]
        .customer_status,

    accessStatus:
      rows[0]
        .access_status,

    keyHash:
      rows[0]
        .key_hash,

    keySalt:
      rows[0]
        .key_salt,

    keyAlgorithm:
      rows[0]
        .key_algorithm,

    accessVersion:
      Number(
        rows[0]
          .access_version,
      ),

    failedAttempts:
      Number(
        rows[0]
          .failed_attempts ||
        0,
      ),

    lockedUntil:
      normalizeDate(
        rows[0]
          .locked_until,
      ),
  }
}

export async function recordCertificateAccessFailure({
  certificateId,
  userAgent = null,
}) {
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
      WITH updated_credential AS (
        UPDATE
          gc_certificate_access_credentials

        SET
          failed_attempts =
            failed_attempts + 1,

          locked_until =
            CASE
              WHEN
                failed_attempts + 1 >=
                  ${MAX_FAILED_ATTEMPTS}
              THEN
                NOW() +
                  (${LOCK_MINUTES} * INTERVAL '1 minute')
              ELSE
                locked_until
            END,

          updated_at =
            NOW()

        WHERE
          certificate_id =
            ${normalizedCertificateId}::UUID

        RETURNING
          certificate_id,
          failed_attempts,
          locked_until
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
          'access_key_login',

          CASE
            WHEN locked_until IS NOT NULL
            THEN 'blocked'
            ELSE 'failure'
          END,

          ${normalizedUserAgent},

          jsonb_build_object(
            'failedAttempts',
            failed_attempts
          )

        FROM
          updated_credential

        RETURNING id
      )

      SELECT
        certificate_id,
        failed_attempts,
        locked_until

      FROM
        updated_credential
    `

  if (!rows[0]) {
    throw new Error(
      "Certificate access failure could not be recorded",
    )
  }

  return {
    failedAttempts:
      Number(
        rows[0]
          .failed_attempts,
      ),

    lockedUntil:
      normalizeDate(
        rows[0]
          .locked_until,
      ),
  }
}

export async function recordCertificateAccessBlocked({
  certificateId,
  userAgent = null,
}) {
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

  await sql`
    INSERT INTO
      gc_certificate_access_events (
        certificate_id,
        event_type,
        outcome,
        user_agent,
        metadata
      )

    VALUES (
      ${normalizedCertificateId}::UUID,
      'access_key_login',
      'blocked',
      ${normalizedUserAgent},
      jsonb_build_object(
        'reason',
        'temporary_lock'
      )
    )
  `
}

export async function createCertificateAccessSession({
  certificateId,
  sessionTokenHash,
  accessVersion,
  expiresAt,
  userAgent = null,
}) {
  const normalizedCertificateId =
    normalizeCertificateId(
      certificateId,
    )

  const normalizedSessionTokenHash =
    normalizeTokenHash(
      sessionTokenHash,
    )

  const normalizedAccessVersion =
    normalizeAccessVersion(
      accessVersion,
    )

  const normalizedExpiresAt =
    normalizeFutureDate(
      expiresAt,
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
      WITH eligible_credential AS (
        SELECT
          credential.certificate_id,
          credential.access_version

        FROM
          gc_certificate_access_credentials
            AS credential

        INNER JOIN
          gc_certificates
            AS certificate
          ON certificate.id =
            credential.certificate_id

        INNER JOIN
          gc_customers
            AS customer
          ON customer.id =
            certificate.customer_id

        WHERE
          credential.certificate_id =
            ${normalizedCertificateId}::UUID

          AND credential.status =
            'active'

          AND credential.access_version =
            ${normalizedAccessVersion}

          AND certificate.status =
            'active'

          AND customer.status =
            'active'

        FOR UPDATE OF credential
      ),

      inserted_session AS (
        INSERT INTO
          gc_certificate_access_sessions (
            certificate_id,
            session_token_hash,
            access_version,
            expires_at
          )

        SELECT
          certificate_id,
          ${normalizedSessionTokenHash},
          access_version,
          ${normalizedExpiresAt}::TIMESTAMPTZ

        FROM
          eligible_credential

        RETURNING
          id,
          certificate_id,
          access_version,
          expires_at,
          created_at
      ),

      updated_credential AS (
        UPDATE
          gc_certificate_access_credentials
            AS credential

        SET
          failed_attempts = 0,
          locked_until = NULL,
          last_authenticated_at = NOW(),
          updated_at = NOW()

        FROM
          inserted_session

        WHERE
          credential.certificate_id =
            inserted_session
              .certificate_id

        RETURNING
          credential.certificate_id
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
          inserted_session
            .certificate_id,

          'access_key_login',
          'success',
          ${normalizedUserAgent},

          jsonb_build_object(
            'accessVersion',
            inserted_session
              .access_version
          )

        FROM
          inserted_session

        RETURNING id
      )

      SELECT
        id,
        certificate_id,
        access_version,
        expires_at,
        created_at

      FROM
        inserted_session
    `

  if (!rows[0]) {
    throw new Error(
      "Certificate access session could not be created",
    )
  }

  return {
    id:
      rows[0].id,

    certificateId:
      rows[0]
        .certificate_id,

    accessVersion:
      Number(
        rows[0]
          .access_version,
      ),

    expiresAt:
      new Date(
        rows[0]
          .expires_at,
      ).toISOString(),

    createdAt:
      new Date(
        rows[0]
          .created_at,
      ).toISOString(),
  }
}

export async function getCertificateForAuthorizedSession({
  evidenceKey,
  sessionTokenHash,
}) {
  const normalizedEvidenceKey =
    normalizeEvidenceKey(
      evidenceKey,
    )

  const normalizedSessionTokenHash =
    normalizeTokenHash(
      sessionTokenHash,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      WITH valid_access AS (
        SELECT
          access_session.id
            AS session_id,

          certificate.id
            AS certificate_id,

          certificate.evidence_key,

          certificate.file_hash,

          certificate.file_name,

          certificate.created_at
            AS certificate_created_at,

          customer.name
            AS owner_name,

          customer.email
            AS owner_email,

          customer.owner_type,

          order_record
            .stripe_payment_intent_id,

          order_record
            .stripe_checkout_session_id

        FROM
          gc_certificate_access_sessions
            AS access_session

        INNER JOIN
          gc_certificates
            AS certificate
          ON certificate.id =
            access_session
              .certificate_id

        INNER JOIN
          gc_certificate_access_credentials
            AS credential
          ON credential.certificate_id =
            certificate.id

        INNER JOIN
          gc_customers
            AS customer
          ON customer.id =
            certificate.customer_id

        LEFT JOIN
          gc_orders
            AS order_record
          ON order_record.id =
            certificate.source_order_id

        WHERE
          access_session
              .session_token_hash =
            ${normalizedSessionTokenHash}

          AND certificate.evidence_key =
            ${normalizedEvidenceKey}

          AND access_session.revoked_at
            IS NULL

          AND access_session.expires_at >
            NOW()

          AND access_session.access_version =
            credential.access_version

          AND credential.status =
            'active'

          AND certificate.status =
            'active'

          AND customer.status =
            'active'

        LIMIT 1
      ),

      touched_session AS (
        UPDATE
          gc_certificate_access_sessions
            AS access_session

        SET
          last_used_at =
            NOW()

        FROM
          valid_access

        WHERE
          access_session.id =
            valid_access.session_id

        RETURNING
          access_session.id
      )

      SELECT
        valid_access.*

      FROM
        valid_access

      INNER JOIN
        touched_session
      ON touched_session.id =
        valid_access.session_id
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

    fileHash:
      rows[0]
        .file_hash,

    fileName:
      rows[0]
        .file_name ||
      "",

    ownerName:
      rows[0]
        .owner_name ||
      "",

    ownerEmail:
      rows[0]
        .owner_email ||
      "",

    ownerType:
      rows[0]
        .owner_type ||
      "individual",

    paymentId:
      rows[0]
        .stripe_payment_intent_id ||
      rows[0]
        .stripe_checkout_session_id ||
      "",

    createdAt:
      normalizeDate(
        rows[0]
          .certificate_created_at,
      ),
  }
}