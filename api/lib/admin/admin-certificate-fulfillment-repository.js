import {
  getDatabaseClient,
} from "../db.js"

function normalizeRequiredText(
  value,
  fieldName,
  maximumLength = 500,
) {
  const normalizedValue =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  if (!normalizedValue) {
    throw new Error(
      `${fieldName} is required`,
    )
  }

  return normalizedValue
}

function normalizeOptionalText(
  value,
  maximumLength = 500,
) {
  const normalizedValue =
    String(value || "")
      .trim()
      .slice(
        0,
        maximumLength,
      )

  return normalizedValue || null
}

function normalizeFileHash(value) {
  const fileHash =
    String(value || "")
      .trim()

  if (
    !/^0x[0-9a-fA-F]{64}$/.test(
      fileHash,
    )
  ) {
    throw new Error(
      "A valid SHA-256 file hash is required",
    )
  }

  return fileHash
}

function normalizeDeliveryError(
  value,
) {
  return (
    String(
      value ||
      "Certificate delivery failed",
    )
      .trim()
      .slice(0, 1000) ||
    "Certificate delivery failed"
  )
}

function toNumber(value) {
  const number =
    Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function normalizeDate(value) {
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

function mapCertificateState(
  row,
) {
  if (!row) {
    return null
  }

  return {
    order: {
      id:
        row.order_id,

      fulfillmentStatus:
        row.fulfillment_status,

      creditsPurchased:
        toNumber(
          row.credits_purchased,
        ),
    },

    customerStatus:
      row.customer_status,

    creditAccount: {
      id:
        row.credit_account_id,

      status:
        row.credit_account_status,

      balance:
        toNumber(
          row.credit_balance,
        ),

      totalGranted:
        toNumber(
          row.total_granted,
        ),

      totalUsed:
        toNumber(
          row.total_used,
        ),
    },

    certificate:
      row.certificate_id
        ? {
            id:
              row.certificate_id,

            evidenceKey:
              row.evidence_key,

            fileHash:
              row.file_hash,

            fileName:
              row.file_name ||
              null,

            status:
              row.certificate_status,

            deliveryStatus:
              row.delivery_status,

            deliveryAttempts:
              toNumber(
                row.delivery_attempts,
              ),

            deliveredAt:
              normalizeDate(
                row.delivered_at,
              ),

            lastDeliveryError:
              row.last_delivery_error ||
              null,

            creditLedgerEntryId:
              row.credit_ledger_entry_id,
          }
        : null,
  }
}

function validateCertificateState(
  state,
) {
  if (!state) {
    throw new Error(
      "The paid order could not be located",
    )
  }

  if (!state.certificate) {
    if (
      state.customerStatus !==
      "active"
    ) {
      throw new Error(
        "The customer account is not active",
      )
    }

    if (
      state.creditAccount.status !==
      "active"
    ) {
      throw new Error(
        "The credit account is not active",
      )
    }

    if (
      state.creditAccount.balance < 1
    ) {
      throw new Error(
        "The customer does not have an available credit",
      )
    }

    throw new Error(
      "The certificate could not be reserved",
    )
  }

  if (
    !state.certificate
      .creditLedgerEntryId
  ) {
    throw new Error(
      "The certificate does not have a credit consumption record",
    )
  }
}

export async function prepareCertificateFulfillment({
  customerId,
  orderId,
  fileHash,
  fileName = null,
  evidenceKey,
  hashAlgorithm = "sha-256",
  hashVersion = "1",
}) {
  const normalizedCustomerId =
    normalizeRequiredText(
      customerId,
      "customerId",
      100,
    )

  const normalizedOrderId =
    normalizeRequiredText(
      orderId,
      "orderId",
      100,
    )

  const normalizedFileHash =
    normalizeFileHash(
      fileHash,
    )

  const normalizedFileName =
    normalizeOptionalText(
      fileName,
      500,
    )

  const normalizedEvidenceKey =
    normalizeRequiredText(
      evidenceKey,
      "evidenceKey",
      255,
    )

  const normalizedHashAlgorithm =
    normalizeRequiredText(
      hashAlgorithm,
      "hashAlgorithm",
      50,
    )
      .toLowerCase()

  const normalizedHashVersion =
    normalizeRequiredText(
      hashVersion,
      "hashVersion",
      50,
    )

  const lockKey =
    [
      normalizedOrderId,
      normalizedFileHash,
    ].join(":")

  const sql =
    getDatabaseClient()

  const [
    ,
    mutationRows,
    stateRows,
  ] =
    await sql.transaction([
      sql`
        SELECT
          pg_advisory_xact_lock(
            hashtextextended(
              ${lockKey}::TEXT,
              0
            )
          )
      `,

      sql`
        WITH target_order AS (
          SELECT
            order_record.id
              AS order_id,

            order_record.customer_id,

            order_record
              .credits_purchased

          FROM gc_orders
            AS order_record

          WHERE
            order_record.id =
              ${normalizedOrderId}::UUID

            AND order_record.customer_id =
              ${normalizedCustomerId}::UUID

            AND order_record.payment_status =
              'paid'
        ),

        eligible_account AS (
          SELECT
            credit_account.id
              AS account_id,

            credit_account.balance,

            target_order.order_id,

            target_order.customer_id,

            target_order
              .credits_purchased

          FROM target_order

          INNER JOIN gc_customers
            AS customer
            ON customer.id =
              target_order.customer_id

          INNER JOIN gc_credit_accounts
            AS credit_account
            ON credit_account.customer_id =
              target_order.customer_id

          WHERE
            customer.status = 'active'

            AND credit_account.status =
              'active'

            AND credit_account.balance >= 1

            AND NOT EXISTS (
              SELECT 1

              FROM gc_certificates
                AS existing_certificate

              WHERE
                existing_certificate
                  .source_order_id =
                  target_order.order_id

                AND existing_certificate
                  .file_hash =
                  ${normalizedFileHash}
            )

          FOR UPDATE OF credit_account
        ),

        previous_usage AS (
          SELECT
            eligible_account.order_id,

            eligible_account
              .credits_purchased,

            COALESCE(
              SUM(
                CASE
                  WHEN ledger.operation_type =
                    'certificate_consumption'
                  THEN
                    ABS(ledger.delta)
                  ELSE 0
                END
              ),
              0
            )::INTEGER
              AS used_credits

          FROM eligible_account

          LEFT JOIN gc_credit_ledger
            AS ledger
            ON ledger.order_id =
              eligible_account.order_id

          GROUP BY
            eligible_account.order_id,
            eligible_account
              .credits_purchased
        ),

        updated_account AS (
          UPDATE gc_credit_accounts
            AS credit_account

          SET
            balance =
              credit_account.balance - 1,

            total_used =
              credit_account.total_used + 1,

            updated_at = NOW()

          FROM eligible_account

          WHERE
            credit_account.id =
              eligible_account.account_id

          RETURNING
            credit_account.id
              AS account_id,

            credit_account.balance
              AS balance_after,

            eligible_account.order_id,

            eligible_account.customer_id
        ),

        inserted_ledger AS (
          INSERT INTO gc_credit_ledger (
            account_id,
            order_id,
            operation_type,
            delta,
            balance_after,
            reason,
            reference_type,
            reference_id,
            metadata
          )

          SELECT
            updated_account.account_id,
            updated_account.order_id,
            'certificate_consumption',
            -1,
            updated_account.balance_after,
            'Crédito consumido para emissão de certificado.',
            'evidence_key',
            ${normalizedEvidenceKey},

            jsonb_build_object(
              'source',
              'guardianchain_certificate',

              'fileHash',
              ${normalizedFileHash}::TEXT,

              'hashAlgorithm',
              ${normalizedHashAlgorithm}::TEXT,

              'hashVersion',
              ${normalizedHashVersion}::TEXT
            )

          FROM updated_account

          RETURNING
            id,
            account_id,
            order_id,
            balance_after
        ),

        inserted_certificate AS (
          INSERT INTO gc_certificates (
            customer_id,
            source_order_id,
            credit_ledger_entry_id,
            evidence_key,
            file_hash,
            hash_algorithm,
            hash_version,
            file_name,
            status,
            delivery_status
          )

          SELECT
            updated_account.customer_id,
            updated_account.order_id,
            inserted_ledger.id,
            ${normalizedEvidenceKey},
            ${normalizedFileHash},
            ${normalizedHashAlgorithm},
            ${normalizedHashVersion},
            ${normalizedFileName},
            'active',
            'pending'

          FROM updated_account

          INNER JOIN inserted_ledger
            ON inserted_ledger.order_id =
              updated_account.order_id

          ON CONFLICT (
            source_order_id,
            file_hash
          )
          WHERE source_order_id
            IS NOT NULL

          DO NOTHING

          RETURNING
            id,
            source_order_id,
            credit_ledger_entry_id
        ),

        updated_order AS (
          UPDATE gc_orders
            AS order_record

          SET
            fulfillment_status =
              CASE
                WHEN
                  previous_usage.used_credits +
                  1 >=
                  previous_usage
                    .credits_purchased
                THEN 'consumed'
                ELSE 'partially_used'
              END,

            updated_at = NOW()

          FROM previous_usage

          INNER JOIN inserted_ledger
            ON inserted_ledger.order_id =
              previous_usage.order_id

          WHERE
            order_record.id =
              previous_usage.order_id

          RETURNING
            order_record.id,
            order_record
              .fulfillment_status
        )

        SELECT
          inserted_certificate.id
            AS certificate_id,

          inserted_certificate
            .credit_ledger_entry_id,

          updated_order
            .fulfillment_status

        FROM inserted_certificate

        INNER JOIN updated_order
          ON updated_order.id =
            inserted_certificate
              .source_order_id
      `,

      sql`
        SELECT
          order_record.id
            AS order_id,

          order_record
            .fulfillment_status,

          order_record
            .credits_purchased,

          customer.status
            AS customer_status,

          credit_account.id
            AS credit_account_id,

          credit_account.status
            AS credit_account_status,

          credit_account.balance
            AS credit_balance,

          credit_account.total_granted,

          credit_account.total_used,

          certificate.id
            AS certificate_id,

          certificate.evidence_key,

          certificate.file_hash,

          certificate.file_name,

          certificate.status
            AS certificate_status,

          certificate.delivery_status,

          certificate.delivery_attempts,

          certificate.delivered_at,

          certificate
            .last_delivery_error,

          certificate
            .credit_ledger_entry_id

        FROM gc_orders
          AS order_record

        INNER JOIN gc_customers
          AS customer
          ON customer.id =
            order_record.customer_id

        INNER JOIN gc_credit_accounts
          AS credit_account
          ON credit_account.customer_id =
            order_record.customer_id

        LEFT JOIN gc_certificates
          AS certificate
          ON certificate.source_order_id =
            order_record.id

          AND certificate.file_hash =
            ${normalizedFileHash}

        WHERE
          order_record.id =
            ${normalizedOrderId}::UUID

          AND order_record.customer_id =
            ${normalizedCustomerId}::UUID

        LIMIT 1
      `,
    ])

  const state =
    mapCertificateState(
      stateRows[0],
    )

  validateCertificateState(
    state,
  )

  return {
    ...state,

    certificateCreatedNow:
      mutationRows.length > 0,

    creditConsumedNow:
      mutationRows.length > 0,

    shouldSendEmail:
      state.certificate
        .deliveryStatus !== "sent",
  }
}

export async function markCertificateDeliverySent({
  certificateId,
}) {
  const normalizedCertificateId =
    normalizeRequiredText(
      certificateId,
      "certificateId",
      100,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      UPDATE gc_certificates

      SET
        delivery_status = 'sent',

        delivery_attempts =
          delivery_attempts + 1,

        delivered_at =
          COALESCE(
            delivered_at,
            NOW()
          ),

        last_delivery_error = NULL

      WHERE
        id =
          ${normalizedCertificateId}::UUID

      RETURNING
        id,
        delivery_status,
        delivery_attempts,
        delivered_at
    `

  if (!rows[0]) {
    throw new Error(
      "The certificate could not be marked as delivered",
    )
  }

  return {
    id:
      rows[0].id,

    deliveryStatus:
      rows[0]
        .delivery_status,

    deliveryAttempts:
      toNumber(
        rows[0]
          .delivery_attempts,
      ),

    deliveredAt:
      normalizeDate(
        rows[0]
          .delivered_at,
      ),
  }
}

export async function markCertificateDeliveryFailed({
  certificateId,
  errorMessage,
}) {
  const normalizedCertificateId =
    normalizeRequiredText(
      certificateId,
      "certificateId",
      100,
    )

  const normalizedError =
    normalizeDeliveryError(
      errorMessage,
    )

  const sql =
    getDatabaseClient()

  const rows =
    await sql`
      UPDATE gc_certificates

      SET
        delivery_status = 'error',

        delivery_attempts =
          delivery_attempts + 1,

        last_delivery_error =
          ${normalizedError}

      WHERE
        id =
          ${normalizedCertificateId}::UUID

      RETURNING
        id,
        delivery_status,
        delivery_attempts,
        last_delivery_error
    `

  if (!rows[0]) {
    throw new Error(
      "The certificate delivery failure could not be recorded",
    )
  }

  return {
    id:
      rows[0].id,

    deliveryStatus:
      rows[0]
        .delivery_status,

    deliveryAttempts:
      toNumber(
        rows[0]
          .delivery_attempts,
      ),

    lastDeliveryError:
      rows[0]
        .last_delivery_error,
  }
}