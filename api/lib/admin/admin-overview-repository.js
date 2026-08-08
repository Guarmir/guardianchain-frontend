import { getDatabaseClient } from "../db.js"

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

function mapProduct(row) {
  return {
    id: row.id,
    productType: row.product_type,
    credits: toNumber(row.credits),
    currency: row.currency,
    unitAmount: toNumber(row.unit_amount),
    active: Boolean(row.active),
    checkoutEnabled: Boolean(row.checkout_enabled),
    highlighted: Boolean(row.highlighted),
    catalogVersion: row.catalog_version,
    version: toNumber(row.version),
  }
}

export async function getAdminFoundationSnapshot() {
  const sql = getDatabaseClient()

  const tableRows = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE
      table_schema = 'public'
      AND table_name LIKE 'gc_%'
    ORDER BY table_name
  `

  const migrationRows = await sql`
    SELECT
      migration_name,
      checksum,
      applied_at
    FROM gc_schema_migrations
    ORDER BY migration_name
  `

  const productRows = await sql`
    SELECT
      id,
      product_type,
      credits,
      currency,
      unit_amount,
      active,
      checkout_enabled,
      highlighted,
      catalog_version,
      version
    FROM gc_products
    ORDER BY
      CASE id
        WHEN 'single-certificate' THEN 1
        WHEN 'package-5-records' THEN 2
        WHEN 'package-8-records' THEN 3
        WHEN 'package-12-records' THEN 4
        ELSE 99
      END
  `

  const totalRows = await sql`
    SELECT
      (
        SELECT COUNT(*)::INTEGER
        FROM gc_admin_users
      ) AS admin_users,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_admin_sessions
        WHERE
          revoked_at IS NULL
          AND expires_at > NOW()
      ) AS active_admin_sessions,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_customers
      ) AS customers,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_orders
      ) AS orders,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_orders
        WHERE payment_status = 'paid'
      ) AS paid_orders,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_credit_accounts
      ) AS credit_accounts,

      (
        SELECT COALESCE(SUM(balance), 0)::INTEGER
        FROM gc_credit_accounts
      ) AS available_credits,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_certificates
      ) AS certificates,

      (
        SELECT COUNT(*)::INTEGER
        FROM gc_admin_audit_logs
      ) AS audit_logs
  `

  const salesRows = await sql`
    SELECT
      product_id,
      COUNT(*)::INTEGER AS order_count,
      COALESCE(SUM(amount_total), 0)::BIGINT
        AS amount_total,
      COALESCE(SUM(credits_purchased), 0)::INTEGER
        AS credits_purchased
    FROM gc_orders
    GROUP BY product_id
    ORDER BY product_id
  `

  const totals = totalRows[0] || {}

  return {
    tables: tableRows.map((row) => row.table_name),

    migrations: migrationRows.map((row) => ({
      migrationName: row.migration_name,
      checksum: row.checksum,
      appliedAt: row.applied_at,
    })),

    products: productRows.map(mapProduct),

    totals: {
      adminUsers: toNumber(totals.admin_users),
      activeAdminSessions: toNumber(
        totals.active_admin_sessions,
      ),
      customers: toNumber(totals.customers),
      orders: toNumber(totals.orders),
      paidOrders: toNumber(totals.paid_orders),
      creditAccounts: toNumber(totals.credit_accounts),
      availableCredits: toNumber(
        totals.available_credits,
      ),
      certificates: toNumber(totals.certificates),
      auditLogs: toNumber(totals.audit_logs),
    },

    salesByProduct: salesRows.map((row) => ({
      productId: row.product_id,
      orderCount: toNumber(row.order_count),
      amountTotal: toNumber(row.amount_total),
      creditsPurchased: toNumber(
        row.credits_purchased,
      ),
    })),
  }
}