import {
  checkDatabaseConnection,
} from "../api/lib/db.js"

import {
  getAdminFoundationSnapshot,
} from "../api/lib/admin/admin-overview-repository.js"

const EXPECTED_TABLES = [
  "gc_admin_audit_logs",
  "gc_admin_sessions",
  "gc_admin_users",
  "gc_certificates",
  "gc_credit_accounts",
  "gc_credit_ledger",
  "gc_customers",
  "gc_orders",
  "gc_products",
  "gc_schema_migrations",
]

const EXPECTED_MIGRATIONS = [
  "001_admin_foundation.sql",
  "002_admin_auth.sql",
  "003_order_fulfillment_idempotency.sql",
  "004_certificate_fulfillment.sql",
  "005_activate_commercial_packages.sql",
]

const EXPECTED_PRODUCT_CATALOG_VERSION =
  "1.2"

const EXPECTED_PRODUCTS = {
  "single-certificate": {
    credits: 1,
    currency: "USD",
    unitAmount: 800,
    active: true,
    checkoutEnabled: true,
  },

  "package-5-records": {
    credits: 5,
    currency: "USD",
    unitAmount: 3500,
    active: true,
    checkoutEnabled: true,
  },

  "package-8-records": {
    credits: 8,
    currency: "USD",
    unitAmount: 5200,
    active: true,
    checkoutEnabled: true,
  },

  "package-12-records": {
    credits: 12,
    currency: "USD",
    unitAmount: 7200,
    active: true,
    checkoutEnabled: true,
  },
}

function formatMoney(
  unitAmount,
  currency,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
    },
  ).format(
    unitAmount / 100,
  )
}

function validateTables(snapshot) {
  const missingTables =
    EXPECTED_TABLES.filter(
      (tableName) =>
        !snapshot.tables.includes(
          tableName,
        ),
    )

  if (missingTables.length > 0) {
    throw new Error(
      `Missing administrative tables: ${missingTables.join(", ")}`,
    )
  }
}

function validateMigrations(snapshot) {
  const appliedMigrationNames =
    snapshot.migrations.map(
      (migration) =>
        migration.migrationName,
    )

  const missingMigrations =
    EXPECTED_MIGRATIONS.filter(
      (migrationName) =>
        !appliedMigrationNames.includes(
          migrationName,
        ),
    )

  if (missingMigrations.length > 0) {
    throw new Error(
      `Missing migrations: ${missingMigrations.join(", ")}`,
    )
  }
}

function validateProducts(snapshot) {
  for (
    const [
      productId,
      expected,
    ] of Object.entries(
      EXPECTED_PRODUCTS,
    )
  ) {
    const product =
      snapshot.products.find(
        (item) =>
          item.id === productId,
      )

    if (!product) {
      throw new Error(
        `Missing product: ${productId}`,
      )
    }

    const matches =
      product.credits ===
        expected.credits &&
      product.currency ===
        expected.currency &&
      product.unitAmount ===
        expected.unitAmount &&
      product.active ===
        expected.active &&
      product.checkoutEnabled ===
        expected.checkoutEnabled &&
      product.catalogVersion ===
        EXPECTED_PRODUCT_CATALOG_VERSION

    if (!matches) {
      throw new Error(
        `Unexpected configuration for product: ${productId}`,
      )
    }
  }
}

async function runCheck() {
  console.log(
    "[ADMIN CHECK] Checking database connection...",
  )

  const connection =
    await checkDatabaseConnection()

  console.log(
    "[ADMIN CHECK] Connected:",
    {
      databaseName:
        connection?.database_name,

      serverTime:
        connection?.server_time,
    },
  )

  const snapshot =
    await getAdminFoundationSnapshot()

  validateTables(snapshot)
  validateMigrations(snapshot)
  validateProducts(snapshot)

  console.log(
    `[ADMIN CHECK] Tables confirmed: ${snapshot.tables.length}`,
  )

  console.log(
    `[ADMIN CHECK] Migrations confirmed: ${snapshot.migrations.length}`,
  )

  for (
    const migration of
    snapshot.migrations
  ) {
    console.log(
      `- ${migration.migrationName} | applied=${migration.appliedAt}`,
    )
  }

  console.log(
    "[ADMIN CHECK] Products:",
  )

  for (
    const product of
    snapshot.products
  ) {
    console.log(
      [
        `- ${product.id}`,
        `${product.credits} credit(s)`,

        formatMoney(
          product.unitAmount,
          product.currency,
        ),

        `active=${product.active}`,
        `checkout=${product.checkoutEnabled}`,
        `catalog=${product.catalogVersion}`,
      ].join(" | "),
    )
  }

  console.log(
    "[ADMIN CHECK] Current totals:",
    snapshot.totals,
  )

  if (
    snapshot.salesByProduct
      .length === 0
  ) {
    console.log(
      "[ADMIN CHECK] No product sales recorded yet.",
    )
  } else {
    console.log(
      "[ADMIN CHECK] Sales by product:",
      snapshot.salesByProduct,
    )
  }

  console.log(
    "[ADMIN CHECK] GuardianChain administrative foundation is valid.",
  )
}

runCheck().catch(
  (error) => {
    console.error(
      "[ADMIN CHECK] Validation failed:",
      error,
    )

    process.exitCode = 1
  },
)