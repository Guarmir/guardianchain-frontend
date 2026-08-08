import { neon } from "@neondatabase/serverless"

let databaseClient = null

function resolveDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured for GuardianChain",
    )
  }

  return databaseUrl
}

export function hasDatabaseConfiguration() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL ||
      process.env.POSTGRES_URL,
  )
}

export function getDatabaseClient() {
  if (!databaseClient) {
    databaseClient = neon(resolveDatabaseUrl())
  }

  return databaseClient
}

export async function checkDatabaseConnection() {
  const sql = getDatabaseClient()

  const rows = await sql`
    SELECT
      current_database() AS database_name,
      NOW() AS server_time
  `

  return rows[0] || null
}