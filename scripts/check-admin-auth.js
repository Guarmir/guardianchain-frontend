import {
  checkDatabaseConnection,
  getDatabaseClient,
} from "../api/lib/db.js"

import {
  normalizeAdminEmail,
  validateAdminEmail,
} from "../api/lib/admin/password.js"

function requireEnvironmentValue(name) {
  const value = String(
    process.env[name] || "",
  ).trim()

  if (!value) {
    throw new Error(
      `${name} is not configured`,
    )
  }

  return value
}

function maskEmail(email) {
  const [
    localPart,
    domain,
  ] = email.split("@")

  if (!localPart || !domain) {
    return "***"
  }

  const visibleCharacters =
    localPart.slice(0, 2)

  return `${visibleCharacters}***@${domain}`
}

async function checkAdminAuthentication() {
  console.log(
    "[ADMIN AUTH CHECK] Checking database connection...",
  )

  const connection =
    await checkDatabaseConnection()

  console.log(
    "[ADMIN AUTH CHECK] Connected:",
    {
      databaseName:
        connection?.database_name,

      serverTime:
        connection?.server_time,
    },
  )

  const databaseLabel =
    requireEnvironmentValue(
      "GUARDIANCHAIN_DATABASE_LABEL",
    )

  if (
    databaseLabel !==
    "guardianchain-dev"
  ) {
    throw new Error(
      "Unexpected GuardianChain database label",
    )
  }

  const email =
    normalizeAdminEmail(
      requireEnvironmentValue(
        "ADMIN_OWNER_EMAIL",
      ),
    )

  if (!validateAdminEmail(email)) {
    throw new Error(
      "ADMIN_OWNER_EMAIL is invalid",
    )
  }

  const pepper =
    requireEnvironmentValue(
      "ADMIN_AUTH_PEPPER",
    )

  if (pepper.length < 32) {
    throw new Error(
      "ADMIN_AUTH_PEPPER must contain at least 32 characters",
    )
  }

  const sql = getDatabaseClient()

  const ownerRows = await sql`
    SELECT
      id,
      email,
      role,
      status,

      password_hash,
      password_salt,
      password_algorithm,
      password_updated_at,

      must_change_password,
      failed_login_attempts,
      locked_until,
      session_version

    FROM gc_admin_users

    WHERE
      LOWER(email) = LOWER(${email})

    LIMIT 1
  `

  const owner = ownerRows[0]

  if (!owner) {
    throw new Error(
      "Administrative owner was not found",
    )
  }

  if (
    owner.role !== "owner" ||
    owner.status !== "active"
  ) {
    throw new Error(
      "Administrative owner is not active",
    )
  }

  if (
    owner.password_algorithm !==
    "scrypt-v1"
  ) {
    throw new Error(
      "Unexpected administrative password algorithm",
    )
  }

  if (
    typeof owner.password_hash !==
      "string" ||
    owner.password_hash.length !== 128
  ) {
    throw new Error(
      "Administrative password hash is invalid",
    )
  }

  if (
    typeof owner.password_salt !==
      "string" ||
    owner.password_salt.length !== 64
  ) {
    throw new Error(
      "Administrative password salt is invalid",
    )
  }

  if (!owner.password_updated_at) {
    throw new Error(
      "Administrative password date is missing",
    )
  }

  const activeSessionRows =
    await sql`
      SELECT
        COUNT(*)::INTEGER
          AS active_sessions

      FROM gc_admin_sessions

      WHERE
        admin_user_id = ${owner.id}
        AND revoked_at IS NULL
        AND expires_at > NOW()
    `

  const auditRows = await sql`
    SELECT
      COUNT(*)::INTEGER
        AS audit_events

    FROM gc_admin_audit_logs

    WHERE admin_user_id = ${owner.id}
  `

  console.log(
    "[ADMIN AUTH CHECK] Owner:",
    {
      email:
        maskEmail(owner.email),

      role:
        owner.role,

      status:
        owner.status,

      algorithm:
        owner.password_algorithm,

      mustChangePassword:
        Boolean(
          owner.must_change_password,
        ),

      failedLoginAttempts:
        Number(
          owner.failed_login_attempts ||
            0,
        ),

      locked:
        Boolean(
          owner.locked_until &&
            new Date(
              owner.locked_until,
            ).getTime() > Date.now(),
        ),

      sessionVersion:
        Number(
          owner.session_version || 1,
        ),

      activeSessions:
        Number(
          activeSessionRows[0]
            ?.active_sessions || 0,
        ),

      auditEvents:
        Number(
          auditRows[0]
            ?.audit_events || 0,
        ),
    },
  )

  console.log(
    "[ADMIN AUTH CHECK] Administrative authentication foundation is valid.",
  )
}

checkAdminAuthentication().catch(
  (error) => {
    console.error(
      "[ADMIN AUTH CHECK] Validation failed:",
      error,
    )

    process.exitCode = 1
  },
)