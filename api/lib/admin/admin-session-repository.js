import { getDatabaseClient } from "../db.js"

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

function mapSession(row) {
  if (!row) {
    return null
  }

  return {
    id: row.session_id,
    expiresAt: row.expires_at,
    createdAt: row.session_created_at,
    lastSeenAt: row.last_seen_at,

    admin: {
      id: row.admin_user_id,
      email: row.email,
      role: row.role,
      status: row.status,

      mustChangePassword: Boolean(
        row.must_change_password,
      ),

      sessionVersion: toNumber(
        row.admin_session_version,
      ),
    },

    storedSessionVersion: toNumber(
      row.stored_session_version,
    ),

    revokedAt: row.revoked_at,
  }
}

function isFutureDate(value) {
  if (!value) {
    return false
  }

  const date = new Date(value)

  return (
    !Number.isNaN(date.getTime()) &&
    date.getTime() > Date.now()
  )
}

function isSessionActive(session) {
  if (!session) {
    return false
  }

  return (
    session.admin.status === "active" &&
    !session.revokedAt &&
    isFutureDate(session.expiresAt) &&
    session.storedSessionVersion ===
      session.admin.sessionVersion
  )
}

async function revokeInvalidSession(
  sessionId,
) {
  const sql = getDatabaseClient()

  await sql`
    UPDATE gc_admin_sessions

    SET revoked_at = COALESCE(
      revoked_at,
      NOW()
    )

    WHERE id = ${sessionId}
  `
}

async function touchSession(sessionId) {
  const sql = getDatabaseClient()

  const rows = await sql`
    UPDATE gc_admin_sessions

    SET last_seen_at = NOW()

    WHERE
      id = ${sessionId}
      AND revoked_at IS NULL
      AND expires_at > NOW()
      AND (
        last_seen_at IS NULL
        OR last_seen_at <
          NOW() - INTERVAL '5 minutes'
      )

    RETURNING last_seen_at
  `

  return rows[0]?.last_seen_at || null
}

export async function resolveActiveAdminSession({
  tokenHash,
  touch = true,
}) {
  if (!tokenHash) {
    return null
  }

  const sql = getDatabaseClient()

  const rows = await sql`
    SELECT
      session.id AS session_id,
      session.admin_user_id,
      session.session_version
        AS stored_session_version,
      session.expires_at,
      session.revoked_at,
      session.last_seen_at,
      session.created_at
        AS session_created_at,

      admin.email,
      admin.role,
      admin.status,
      admin.must_change_password,
      admin.session_version
        AS admin_session_version

    FROM gc_admin_sessions AS session

    INNER JOIN gc_admin_users AS admin
      ON admin.id =
        session.admin_user_id

    WHERE
      session.token_hash =
        ${tokenHash}

    LIMIT 1
  `

  const session = mapSession(rows[0])

  if (!session) {
    return null
  }

  if (!isSessionActive(session)) {
    if (!session.revokedAt) {
      await revokeInvalidSession(
        session.id,
      )
    }

    return null
  }

  if (touch) {
    const lastSeenAt =
      await touchSession(session.id)

    if (lastSeenAt) {
      session.lastSeenAt =
        lastSeenAt
    }
  }

  return session
}

export async function revokeAdminSessionByTokenHash({
  tokenHash,
  ipAddress,
  userAgent,
}) {
  if (!tokenHash) {
    return {
      revoked: false,
    }
  }

  const sql = getDatabaseClient()

  const rows = await sql`
    UPDATE gc_admin_sessions
      AS session

    SET revoked_at = COALESCE(
      session.revoked_at,
      NOW()
    )

    FROM gc_admin_users AS admin

    WHERE
      session.token_hash =
        ${tokenHash}

      AND admin.id =
        session.admin_user_id

    RETURNING
      session.id,
      session.admin_user_id,
      session.revoked_at,
      admin.email
  `

  const revokedSession = rows[0]

  if (!revokedSession) {
    return {
      revoked: false,
    }
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
      ${revokedSession.admin_user_id},
      ${revokedSession.email},
      'admin.logout.succeeded',
      'admin_session',
      ${revokedSession.id},

      ${JSON.stringify({
        sessionId:
          revokedSession.id,

        revokedAt:
          revokedSession.revoked_at,

        ipAddress,
        userAgent,
      })}::JSONB,

      'Administrative logout completed'
    )
  `

  return {
    revoked: true,
    sessionId: revokedSession.id,
    revokedAt:
      revokedSession.revoked_at,
  }
}