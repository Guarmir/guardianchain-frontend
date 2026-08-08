import { getDatabaseClient } from "../db.js"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAXIMUM_PAGE_SIZE = 50

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function normalizePositiveInteger(
  value,
  fallback,
  maximum = null,
) {
  const number = Number.parseInt(
    String(value || ""),
    10,
  )

  if (
    !Number.isInteger(number) ||
    number < 1
  ) {
    return fallback
  }

  if (
    maximum !== null &&
    number > maximum
  ) {
    return maximum
  }

  return number
}

function normalizeDate(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

function maskCustomerName(value) {
  const normalizedName = String(
    value || "",
  )
    .trim()
    .replace(/\s+/g, " ")

  if (!normalizedName) {
    return null
  }

  return normalizedName
    .split(" ")
    .filter(Boolean)
    .map((namePart) => {
      const initial =
        namePart
          .slice(0, 1)
          .toUpperCase()

      return initial
        ? `${initial}.`
        : ""
    })
    .filter(Boolean)
    .join(" ")
}

function maskEmailLocalPart(value) {
  if (!value) {
    return "***"
  }

  if (value.length === 1) {
    return `${value}***`
  }

  if (value.length === 2) {
    return `${value.slice(0, 1)}***${value.slice(-1)}`
  }

  return `${value.slice(0, 2)}***${value.slice(-1)}`
}

function maskEmailDomain(value) {
  const domainParts = String(
    value || "",
  )
    .split(".")
    .filter(Boolean)

  if (domainParts.length === 0) {
    return "***"
  }

  const domainName =
    domainParts.shift()

  const maskedDomainName =
    domainName.length === 1
      ? `${domainName}***`
      : `${domainName.slice(0, 1)}***`

  if (domainParts.length === 0) {
    return maskedDomainName
  }

  return [
    maskedDomainName,
    ...domainParts,
  ].join(".")
}

function maskCustomerEmail(value) {
  const normalizedEmail = String(
    value || "",
  )
    .trim()
    .toLowerCase()

  const separatorIndex =
    normalizedEmail.lastIndexOf("@")

  if (
    separatorIndex <= 0 ||
    separatorIndex >=
      normalizedEmail.length - 1
  ) {
    return null
  }

  const localPart =
    normalizedEmail.slice(
      0,
      separatorIndex,
    )

  const domainPart =
    normalizedEmail.slice(
      separatorIndex + 1,
    )

  return [
    maskEmailLocalPart(localPart),
    maskEmailDomain(domainPart),
  ].join("@")
}

function mapCustomer(row) {
  return {
    id:
      row.id,

    maskedName:
      maskCustomerName(
        row.name,
      ),

    maskedEmail:
      maskCustomerEmail(
        row.email,
      ),

    sensitiveDataMasked:
      true,

    ownerType:
      row.owner_type,

    status:
      row.status,

    creditAccount: {
      status:
        row.credit_account_status ||
        "not_created",

      balance:
        toNumber(
          row.credit_balance,
        ),

      totalGranted:
        toNumber(
          row.total_credits_granted,
        ),

      totalUsed:
        toNumber(
          row.total_credits_used,
        ),
    },

    activity: {
      totalOrders:
        toNumber(
          row.total_orders,
        ),

      paidOrders:
        toNumber(
          row.paid_orders,
        ),

      totalCertificates:
        toNumber(
          row.total_certificates,
        ),

      lastOrderAt:
        normalizeDate(
          row.last_order_at,
        ),

      lastCertificateAt:
        normalizeDate(
          row.last_certificate_at,
        ),
    },

    createdAt:
      normalizeDate(
        row.created_at,
      ),

    updatedAt:
      normalizeDate(
        row.updated_at,
      ),
  }
}

export async function getAdminCustomersPage({
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
} = {}) {
  const normalizedPage =
    normalizePositiveInteger(
      page,
      DEFAULT_PAGE,
    )

  const normalizedPageSize =
    normalizePositiveInteger(
      pageSize,
      DEFAULT_PAGE_SIZE,
      MAXIMUM_PAGE_SIZE,
    )

  const offset =
    (normalizedPage - 1) *
    normalizedPageSize

  const sql = getDatabaseClient()

  const countRows = await sql`
    SELECT
      COUNT(*)::INTEGER AS total_items

    FROM gc_customers
  `

  const customerRows = await sql`
    SELECT
      customer.id,
      customer.email,
      customer.name,
      customer.owner_type,
      customer.status,
      customer.created_at,
      customer.updated_at,

      credit_account.status
        AS credit_account_status,

      COALESCE(
        credit_account.balance,
        0
      )::INTEGER
        AS credit_balance,

      COALESCE(
        credit_account.total_granted,
        0
      )::INTEGER
        AS total_credits_granted,

      COALESCE(
        credit_account.total_used,
        0
      )::INTEGER
        AS total_credits_used,

      COALESCE(
        order_summary.total_orders,
        0
      )::INTEGER
        AS total_orders,

      COALESCE(
        order_summary.paid_orders,
        0
      )::INTEGER
        AS paid_orders,

      order_summary.last_order_at,

      COALESCE(
        certificate_summary.total_certificates,
        0
      )::INTEGER
        AS total_certificates,

      certificate_summary.last_certificate_at

    FROM gc_customers AS customer

    LEFT JOIN gc_credit_accounts
      AS credit_account
      ON credit_account.customer_id =
        customer.id

    LEFT JOIN (
      SELECT
        customer_id,

        COUNT(*)::INTEGER
          AS total_orders,

        COUNT(*) FILTER (
          WHERE payment_status = 'paid'
        )::INTEGER
          AS paid_orders,

        MAX(created_at)
          AS last_order_at

      FROM gc_orders

      GROUP BY customer_id
    ) AS order_summary
      ON order_summary.customer_id =
        customer.id

    LEFT JOIN (
      SELECT
        customer_id,

        COUNT(*)::INTEGER
          AS total_certificates,

        MAX(created_at)
          AS last_certificate_at

      FROM gc_certificates

      GROUP BY customer_id
    ) AS certificate_summary
      ON certificate_summary.customer_id =
        customer.id

    ORDER BY
      customer.created_at DESC,
      customer.id DESC

    LIMIT ${normalizedPageSize}
    OFFSET ${offset}
  `

  const totalItems =
    toNumber(
      countRows[0]?.total_items,
    )

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems /
        normalizedPageSize,
    ),
  )

  return {
    customers:
      customerRows.map(
        mapCustomer,
      ),

    pagination: {
      page:
        normalizedPage,

      pageSize:
        normalizedPageSize,

      totalItems,

      totalPages,

      hasPreviousPage:
        normalizedPage > 1,

      hasNextPage:
        normalizedPage <
        totalPages,
    },

    dataProtection: {
      sensitiveFieldsMasked:
        true,

      rawNameExposed:
        false,

      rawEmailExposed:
        false,

      blockedReasonExposed:
        false,
    },
  }
}