import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  checkDatabaseConnection,
  getDatabaseClient,
} from "../api/lib/db.js"

const currentFilePath = fileURLToPath(import.meta.url)
const scriptsDirectory = path.dirname(currentFilePath)
const projectDirectory = path.resolve(scriptsDirectory, "..")

const migrationsDirectory = path.join(
  projectDirectory,
  "database",
  "migrations",
)

function calculateChecksum(content) {
  return createHash("sha256")
    .update(content, "utf8")
    .digest("hex")
}

function splitStatements(migrationContent) {
  return migrationContent
    .split("-- statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean)
}

async function ensureMigrationTable(sql) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS gc_schema_migrations (
      migration_name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function loadMigrationFiles() {
  const entries = await readdir(migrationsDirectory, {
    withFileTypes: true,
  })

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /^\d+.*\.sql$/i.test(entry.name),
    )
    .map((entry) => entry.name)
    .sort((first, second) =>
      first.localeCompare(second, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    )
}

async function loadAppliedMigrations(sql) {
  const rows = await sql`
    SELECT
      migration_name,
      checksum,
      applied_at
    FROM gc_schema_migrations
    ORDER BY migration_name
  `

  return new Map(
    rows.map((row) => [
      row.migration_name,
      {
        checksum: row.checksum,
        appliedAt: row.applied_at,
      },
    ]),
  )
}

async function executeMigration({
  sql,
  migrationName,
  migrationContent,
}) {
  const statements = splitStatements(migrationContent)

  console.log(
    `[DATABASE] Applying ${migrationName} with ${statements.length} statement(s)...`,
  )

  for (
    let index = 0;
    index < statements.length;
    index += 1
  ) {
    const statementNumber = index + 1

    console.log(
      `[DATABASE] ${migrationName} — statement ${statementNumber}/${statements.length}`,
    )

    await sql.query(statements[index])
  }
}

async function registerMigration({
  sql,
  migrationName,
  checksum,
}) {
  await sql`
    INSERT INTO gc_schema_migrations (
      migration_name,
      checksum
    )
    VALUES (
      ${migrationName},
      ${checksum}
    )
  `
}

async function runMigrations() {
  console.log("[DATABASE] Checking connection...")

  const connection = await checkDatabaseConnection()

  console.log("[DATABASE] Connected:", {
    databaseName: connection?.database_name,
    serverTime: connection?.server_time,
  })

  const sql = getDatabaseClient()

  await ensureMigrationTable(sql)

  const migrationFiles = await loadMigrationFiles()
  const appliedMigrations = await loadAppliedMigrations(sql)

  console.log(
    `[DATABASE] Migration files found: ${migrationFiles.length}`,
  )

  let appliedCount = 0
  let skippedCount = 0

  for (const migrationName of migrationFiles) {
    const migrationPath = path.join(
      migrationsDirectory,
      migrationName,
    )

    const migrationContent = await readFile(
      migrationPath,
      "utf8",
    )

    const checksum = calculateChecksum(migrationContent)
    const existingMigration =
      appliedMigrations.get(migrationName)

    if (existingMigration) {
      if (existingMigration.checksum !== checksum) {
        throw new Error(
          `Migration ${migrationName} was already applied, but its file checksum changed.`,
        )
      }

      console.log(
        `[DATABASE] Skipping already applied migration: ${migrationName}`,
      )

      skippedCount += 1
      continue
    }

    await executeMigration({
      sql,
      migrationName,
      migrationContent,
    })

    await registerMigration({
      sql,
      migrationName,
      checksum,
    })

    console.log(
      `[DATABASE] Migration applied successfully: ${migrationName}`,
    )

    appliedCount += 1
  }

  console.log("[DATABASE] Migration summary:", {
    found: migrationFiles.length,
    applied: appliedCount,
    skipped: skippedCount,
  })

  console.log(
    "[DATABASE] GuardianChain migrations completed successfully.",
  )
}

runMigrations().catch((error) => {
  console.error("[DATABASE] Migration failed:", error)
  process.exitCode = 1
})