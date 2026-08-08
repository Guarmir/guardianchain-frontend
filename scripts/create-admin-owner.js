import {
  checkDatabaseConnection,
} from "../api/lib/db.js"

import {
  hashAdminPassword,
  normalizeAdminEmail,
  validateAdminEmail,
} from "../api/lib/admin/password.js"

import {
  createOrReplaceOwnerAdmin,
} from "../api/lib/admin/admin-user-repository.js"

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

async function createOwner() {
  const databaseLabel =
    requireEnvironmentValue(
      "GUARDIANCHAIN_DATABASE_LABEL",
    )

  const bootstrapConfirmation =
    requireEnvironmentValue(
      "ADMIN_BOOTSTRAP_CONFIRM",
    )

  if (
    databaseLabel !== "guardianchain-dev" ||
    bootstrapConfirmation !==
      "guardianchain-dev"
  ) {
    throw new Error(
      "Administrative bootstrap is allowed only for guardianchain-dev",
    )
  }

  const email = normalizeAdminEmail(
    requireEnvironmentValue(
      "ADMIN_OWNER_EMAIL",
    ),
  )

  if (!validateAdminEmail(email)) {
    throw new Error(
      "ADMIN_OWNER_EMAIL is invalid",
    )
  }

  const password =
    requireEnvironmentValue(
      "ADMIN_OWNER_PASSWORD",
    )

  console.log(
    "[ADMIN OWNER] Checking database connection...",
  )

  const connection =
    await checkDatabaseConnection()

  console.log("[ADMIN OWNER] Connected:", {
    databaseName:
      connection?.database_name,

    databaseLabel,
    serverTime:
      connection?.server_time,
  })

  console.log(
    "[ADMIN OWNER] Protecting administrative password...",
  )

  const protectedPassword =
    await hashAdminPassword(password)

  const result =
    await createOrReplaceOwnerAdmin({
      email,

      passwordHash:
        protectedPassword.passwordHash,

      passwordSalt:
        protectedPassword.passwordSalt,

      passwordAlgorithm:
        protectedPassword.passwordAlgorithm,

      databaseLabel,
    })

  console.log(
    result.created
      ? "[ADMIN OWNER] Owner created successfully."
      : "[ADMIN OWNER] Owner credentials updated successfully.",
  )

  console.log("[ADMIN OWNER] Account:", {
    id: result.adminUser.id,
    email: result.adminUser.email,
    role: result.adminUser.role,
    status: result.adminUser.status,

    mustChangePassword:
      result.adminUser.mustChangePassword,

    sessionVersion:
      result.adminUser.sessionVersion,
  })

  console.log(
    "[ADMIN OWNER] Remove ADMIN_OWNER_PASSWORD and ADMIN_BOOTSTRAP_CONFIRM from .env.local now.",
  )
}

createOwner().catch((error) => {
  console.error(
    "[ADMIN OWNER] Creation failed:",
    error,
  )

  process.exitCode = 1
})