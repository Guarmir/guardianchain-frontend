import { getDatabaseClient } from "../db.js"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAXIMUM_PAGE_SIZE = 50

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
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

function mapAuditEvent(row) {
  return {
    id: row.id,
    adminUserId:
      row.admin_user_id || null,

    actorEmail:
      row.actor_email || null,

    action:
      row.action,

    entityType:
      row.entity_type || null,

    entityId:
      row.entity_id || null,

    reason:
      row.reason || null,

    createdAt:
      normalizeDate(row.created_at),
  }
}

export async function getAdminAuditPage({
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
    FROM gc_admin_audit_logs
  `

  const eventRows = await sql`
    SELECT
      id,
      admin_user_id,
      actor_email,
      action,
      entity_type,
      entity_id,
      reason,
      created_at

    FROM gc_admin_audit_logs

    ORDER BY
      created_at DESC,
      id DESC

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
    events:
      eventRows.map(mapAuditEvent),

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
  }
}