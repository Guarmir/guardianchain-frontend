import {
  isIP,
} from "node:net"

import {
  normalizeAdminEmail,
  validateAdminEmail,
  verifyAdminPassword,
} from "./lib/admin/password.js"

import {
  createAdminSessionCredential,
  serializeAdminSessionCookie,
} from "./lib/admin/admin-session.js"

import {
  createAuthenticatedAdminSession,
  findAdminForAuthentication,
  registerAdminLoginFailure,
} from "./lib/admin/admin-auth-repository.js"

const DUMMY_PASSWORD_HASH =
  "0".repeat(128)

const DUMMY_PASSWORD_SALT =
  "0".repeat(64)

const DUMMY_PASSWORD_ALGORITHM =
  "scrypt-v1"

function setSecurityHeaders(response) {
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  )

  response.setHeader(
    "Pragma",
    "no-cache",
  )

  response.setHeader(
    "Expires",
    "0",
  )

  response.setHeader(
    "Content-Type",
    "application/json; charset=utf-8",
  )

  response.setHeader(
    "X-Content-Type-Options",
    "nosniff",
  )
}

function sendJson(
  response,
  statusCode,
  body,
) {
  response.statusCode = statusCode

  response.end(
    JSON.stringify(body),
  )
}

async function readJsonBody(request) {
  if (
    request.body &&
    typeof request.body === "object" &&
    !Buffer.isBuffer(request.body)
  ) {
    return request.body
  }

  if (
    typeof request.body === "string"
  ) {
    return JSON.parse(request.body)
  }

  if (
    Buffer.isBuffer(request.body)
  ) {
    return JSON.parse(
      request.body.toString("utf8"),
    )
  }

  const chunks = []

  for await (const chunk of request) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk),
    )
  }

  if (chunks.length === 0) {
    return {}
  }

  const rawBody = Buffer.concat(
    chunks,
  ).toString("utf8")

  return JSON.parse(rawBody)
}

function readHeader(request, name) {
  const value =
    request.headers?.[
      name.toLowerCase()
    ] ??
    request.headers?.[name]

  if (Array.isArray(value)) {
    return value[0] || ""
  }

  return String(value || "")
}

function getClientIpAddress(request) {
  const forwardedFor = readHeader(
    request,
    "x-forwarded-for",
  )

  const realIp = readHeader(
    request,
    "x-real-ip",
  )

  const candidate = String(
    forwardedFor || realIp || "",
  )
    .split(",")[0]
    .trim()

  return isIP(candidate)
    ? candidate
    : null
}

function getUserAgent(request) {
  return readHeader(
    request,
    "user-agent",
  )
    .trim()
    .slice(0, 512) || null
}

function isAccountLocked(adminUser) {
  if (!adminUser?.lockedUntil) {
    return false
  }

  const lockedUntil = new Date(
    adminUser.lockedUntil,
  )

  if (
    Number.isNaN(
      lockedUntil.getTime(),
    )
  ) {
    return false
  }

  return (
    lockedUntil.getTime() >
    Date.now()
  )
}

async function performDummyPasswordCheck(
  password,
) {
  try {
    await verifyAdminPassword({
      password,

      passwordHash:
        DUMMY_PASSWORD_HASH,

      passwordSalt:
        DUMMY_PASSWORD_SALT,

      passwordAlgorithm:
        DUMMY_PASSWORD_ALGORITHM,
    })
  } catch {
    // The result is intentionally ignored.
  }
}

function sendInvalidCredentials(
  response,
) {
  sendJson(response, 401, {
    success: false,

    error:
      "INVALID_ADMIN_CREDENTIALS",

    message:
      "E-mail ou senha administrativa inválidos.",
  })
}

export default async function handler(
  request,
  response,
) {
  setSecurityHeaders(response)

  if (request.method !== "POST") {
    response.setHeader(
      "Allow",
      "POST",
    )

    sendJson(response, 405, {
      success: false,

      error:
        "METHOD_NOT_ALLOWED",

      message:
        "Método não permitido.",
    })

    return
  }

  let body

  try {
    body =
      await readJsonBody(request)
  } catch {
    sendJson(response, 400, {
      success: false,

      error:
        "INVALID_JSON_BODY",

      message:
        "Os dados enviados são inválidos.",
    })

    return
  }

  const email = normalizeAdminEmail(
    body?.email,
  )

  const password = String(
    body?.password || "",
  )

  if (
    !validateAdminEmail(email) ||
    password.length < 1 ||
    password.length > 128
  ) {
    sendInvalidCredentials(response)
    return
  }

  const ipAddress =
    getClientIpAddress(request)

  const userAgent =
    getUserAgent(request)

  try {
    const adminUser =
      await findAdminForAuthentication(
        email,
      )

    if (!adminUser) {
      await performDummyPasswordCheck(
        password,
      )

      sendInvalidCredentials(response)
      return
    }

    if (
      adminUser.status !== "active"
    ) {
      await performDummyPasswordCheck(
        password,
      )

      sendInvalidCredentials(response)
      return
    }

    if (isAccountLocked(adminUser)) {
      sendInvalidCredentials(response)
      return
    }

    const passwordMatches =
      await verifyAdminPassword({
        password,

        passwordHash:
          adminUser.passwordHash,

        passwordSalt:
          adminUser.passwordSalt,

        passwordAlgorithm:
          adminUser.passwordAlgorithm,
      })

    if (!passwordMatches) {
      await registerAdminLoginFailure({
        adminUser,
        ipAddress,
        userAgent,
      })

      sendInvalidCredentials(response)
      return
    }

    const sessionCredential =
      createAdminSessionCredential()

    const authenticatedSession =
      await createAuthenticatedAdminSession({
        adminUser,

        tokenHash:
          sessionCredential.tokenHash,

        expiresAt:
          sessionCredential.expiresAt,

        ipAddress,
        userAgent,
      })

    response.setHeader(
      "Set-Cookie",

      serializeAdminSessionCookie({
        token:
          sessionCredential.token,

        expiresAt:
          sessionCredential.expiresAt,
      }),
    )

    sendJson(response, 200, {
      success: true,

      admin: {
        id:
          authenticatedSession
            .adminUser.id,

        email:
          authenticatedSession
            .adminUser.email,

        role:
          authenticatedSession
            .adminUser.role,

        mustChangePassword:
          authenticatedSession
            .adminUser
            .mustChangePassword,
      },

      session: {
        expiresAt:
          authenticatedSession
            .session.expiresAt,
      },
    })
  } catch (error) {
    console.error(
      "[ADMIN LOGIN] Authentication failed:",
      {
        name: error?.name,
        message: error?.message,
      },
    )

    sendJson(response, 500, {
      success: false,

      error:
        "ADMIN_LOGIN_UNAVAILABLE",

      message:
        "O login administrativo está temporariamente indisponível.",
    })
  }
}