import {
  getDatabaseClient,
} from "../db.js"

const MAXIMUM_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function mapAdminAuthenticationUser(row) {
  if (!row) {
    return null
  }

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.status,

    passwordHash:
      row.password_hash,

    passwordSalt:
      row.password_salt,

    passwordAlgorithm:
      row.password_algorithm,

    mustChangePassword:
      Boolean(row.must_change_password),

    failedLoginAttempts:
      toNumber(
        row.failed_login_attempts,
      ),

    lockedUntil:
      row.locked_until,

    sessionVersion:
      toNumber(
        row.session_version,
      ) || 1,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  }
}

export async function findAdminForAuthentication(
  email,
) {
  const sql = getDatabaseClient()

  const rows = await sql`
    SELECT
      id,
      email,
      role,
      status,

      password_hash,
      password_salt,
      password_algorithm,
      must_change_password,

      failed_login_attempts,
      locked_until,
      session_version,

      created_at,
      updated_at

    FROM gc_admin_users

    WHERE
      LOWER(email) = LOWER(${email})

    LIMIT 1
  `

  return mapAdminAuthenticationUser(
    rows[0],
  )
}

export async function registerAdminLoginFailure({
  adminUser,
  ipAddress,
  userAgent,
}) {
  const sql = getDatabaseClient()

  const rows = await sql`
    WITH current_state AS (
      SELECT
        id,

        CASE
          WHEN
            locked_until IS NOT NULL
            AND locked_until <= NOW()
          THEN 0

          ELSE failed_login_attempts
        END AS base_attempts

      FROM gc_admin_users

      WHERE id = ${adminUser.id}

      FOR UPDATE
    )

    UPDATE gc_admin_users AS admin

    SET
      failed_login_attempts =
        current_state.base_attempts + 1,

      locked_until =
        CASE
          WHEN
            current_state.base_attempts + 1
            >= ${MAXIMUM_FAILED_ATTEMPTS}

          THEN
            NOW() +
            (
              ${LOCK_DURATION_MINUTES}
              * INTERVAL '1 minute'
            )

          ELSE NULL
        END

    FROM current_state

    WHERE
      admin.id = current_state.id

    RETURNING
      admin.failed_login_attempts,
      admin.locked_until
  `

  const result = rows[0] || {}

  const failedLoginAttempts =
    toNumber(
      result.failed_login_attempts,
    )

  const lockedUntil =
    result.locked_until || null

  await sql`
    INSERT INTO gc_admin_audit_logs (
      admin_user_id,
      actor_email,
      action,
      entity_type,
      entity_id,
      after_data,
      reason
    )
    VALUES (
      ${adminUser.id},
      ${adminUser.email},
      'admin.login.failed',
      'admin_user',
      ${adminUser.id},

      ${JSON.stringify({
        failedLoginAttempts,
        lockedUntil,
        ipAddress,
        userAgent,
      })}::JSONB,

      'Invalid administrative login attempt'
    )
  `

  return {
    failedLoginAttempts,
    lockedUntil,
  }
}

export async function createAuthenticatedAdminSession({
  adminUser,
  tokenHash,
  expiresAt,
  ipAddress,
  userAgent,
}) {
  const sql = getDatabaseClient()

  const sessionRows = await sql`
    INSERT INTO gc_admin_sessions (
      admin_user_id,
      token_hash,
      session_version,
      expires_at,
      last_seen_at,
      ip_address,
      user_agent
    )
    VALUES (
      ${adminUser.id},
      ${tokenHash},
      ${adminUser.sessionVersion},
      ${expiresAt},
      NOW(),
      ${ipAddress},
      ${userAgent}
    )

    RETURNING
      id,
      expires_at,
      created_at
  `

  const session = sessionRows[0]

  if (!session) {
    throw new Error(
      "Administrative session could not be created",
    )
  }

  try {
    const updatedAdminRows = await sql`
      UPDATE gc_admin_users

      SET
        failed_login_attempts = 0,
        locked_until = NULL,
        last_login_at = NOW(),
        last_login_ip = ${ipAddress}

      WHERE
        id = ${adminUser.id}
        AND status = 'active'

      RETURNING
        id,
        email,
        role,
        status,
        must_change_password,
        session_version,
        last_login_at
    `

    const updatedAdmin =
      updatedAdminRows[0]

    if (!updatedAdmin) {
      throw new Error(
        "Administrative account is not active",
      )
    }

    await sql`
      INSERT INTO gc_admin_audit_logs (
        admin_user_id,
        actor_email,
        action,
        entity_type,
        entity_id,
        after_data,
        reason
      )
      VALUES (
        ${adminUser.id},
        ${adminUser.email},
        'admin.login.succeeded',
        'admin_session',
        ${session.id},

        ${JSON.stringify({
          sessionId: session.id,
          expiresAt:
            session.expires_at,
          ipAddress,
          userAgent,
        })}::JSONB,

        'Administrative login completed'
      )
    `

    return {
      session: {
        id: session.id,
        expiresAt:
          session.expires_at,
        createdAt:
          session.created_at,
      },

      adminUser: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        status: updatedAdmin.status,

        mustChangePassword:
          Boolean(
            updatedAdmin.must_change_password,
          ),

        sessionVersion:
          toNumber(
            updatedAdmin.session_version,
          ),

        lastLoginAt:
          updatedAdmin.last_login_at,
      },
    }
  } catch (error) {
    await sql`
      UPDATE gc_admin_sessions

      SET revoked_at = NOW()

      WHERE
        id = ${session.id}
        AND revoked_at IS NULL
    `

    throw error
  }
}