import { getDatabaseClient } from "../db.js"

function mapAdminUser(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,

    mustChangePassword:
      Boolean(row.must_change_password),

    sessionVersion:
      Number(row.session_version || 1),

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function buildAuditSnapshot(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,

    mustChangePassword:
      Boolean(row.must_change_password),

    sessionVersion:
      Number(row.session_version || 1),
  }
}

export async function createOrReplaceOwnerAdmin({
  email,
  passwordHash,
  passwordSalt,
  passwordAlgorithm,
  databaseLabel,
}) {
  const sql = getDatabaseClient()

  const existingRows = await sql`
    SELECT
      id,
      email,
      role,
      status,
      must_change_password,
      session_version,
      created_at,
      updated_at
    FROM gc_admin_users
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `

  const existingUser = existingRows[0] || null

  let resultRows

  if (existingUser) {
    resultRows = await sql`
      UPDATE gc_admin_users
      SET
        email = ${email},
        role = 'owner',
        status = 'active',

        password_hash = ${passwordHash},
        password_salt = ${passwordSalt},
        password_algorithm = ${passwordAlgorithm},

        password_updated_at = NOW(),
        must_change_password = FALSE,

        failed_login_attempts = 0,
        locked_until = NULL,

        session_version =
          session_version + 1

      WHERE id = ${existingUser.id}

      RETURNING
        id,
        email,
        role,
        status,
        must_change_password,
        session_version,
        created_at,
        updated_at
    `
  } else {
    resultRows = await sql`
      INSERT INTO gc_admin_users (
        email,
        role,
        status,

        password_hash,
        password_salt,
        password_algorithm,
        password_updated_at,

        must_change_password,
        failed_login_attempts,
        session_version
      )
      VALUES (
        ${email},
        'owner',
        'active',

        ${passwordHash},
        ${passwordSalt},
        ${passwordAlgorithm},
        NOW(),

        FALSE,
        0,
        1
      )

      RETURNING
        id,
        email,
        role,
        status,
        must_change_password,
        session_version,
        created_at,
        updated_at
    `
  }

  const adminUser = resultRows[0]

  if (!adminUser) {
    throw new Error(
      "Administrative owner could not be saved",
    )
  }

  await sql`
    UPDATE gc_admin_sessions
    SET revoked_at = NOW()
    WHERE
      admin_user_id = ${adminUser.id}
      AND revoked_at IS NULL
  `

  const beforeData =
    buildAuditSnapshot(existingUser)

  const afterData =
    buildAuditSnapshot(adminUser)

  await sql`
    INSERT INTO gc_admin_audit_logs (
      admin_user_id,
      actor_email,
      action,
      entity_type,
      entity_id,
      before_data,
      after_data,
      reason
    )
    VALUES (
      ${adminUser.id},
      ${email},
      ${
        existingUser
          ? "admin.owner.credentials_rotated"
          : "admin.owner.created"
      },
      'admin_user',
      ${adminUser.id},
      ${JSON.stringify(beforeData)}::JSONB,
      ${JSON.stringify(afterData)}::JSONB,
      ${`Administrative owner bootstrap for ${databaseLabel}`}
    )
  `

  return {
    created: !existingUser,
    adminUser: mapAdminUser(adminUser),
  }
}