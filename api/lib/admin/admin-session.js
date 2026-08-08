import {
  createHash,
  randomBytes,
} from "node:crypto"

export const ADMIN_SESSION_COOKIE_NAME =
  "gc_admin_session"

const DEFAULT_SESSION_HOURS = 8
const MINIMUM_SESSION_HOURS = 1
const MAXIMUM_SESSION_HOURS = 24

function getSessionDurationHours() {
  const configuredValue = Number(
    process.env.ADMIN_SESSION_HOURS ||
      DEFAULT_SESSION_HOURS,
  )

  if (
    !Number.isInteger(configuredValue) ||
    configuredValue < MINIMUM_SESSION_HOURS ||
    configuredValue > MAXIMUM_SESSION_HOURS
  ) {
    throw new Error(
      "ADMIN_SESSION_HOURS must be an integer between 1 and 24",
    )
  }

  return configuredValue
}

function shouldUseSecureCookie() {
  const vercelEnvironment = String(
    process.env.VERCEL_ENV || "",
  )
    .trim()
    .toLowerCase()

  return (
    vercelEnvironment === "production" ||
    vercelEnvironment === "preview" ||
    process.env.NODE_ENV === "production"
  )
}

export function hashAdminSessionToken(token) {
  const normalizedToken = String(
    token || "",
  ).trim()

  if (!normalizedToken) {
    return null
  }

  return createHash("sha256")
    .update(normalizedToken, "utf8")
    .digest("hex")
}

export function createAdminSessionCredential() {
  const token = randomBytes(48).toString(
    "base64url",
  )

  const tokenHash =
    hashAdminSessionToken(token)

  const durationHours =
    getSessionDurationHours()

  const expiresAt = new Date(
    Date.now() +
      durationHours * 60 * 60 * 1000,
  )

  return {
    token,
    tokenHash,
    expiresAt,
    durationHours,
  }
}

export function serializeAdminSessionCookie({
  token,
  expiresAt,
}) {
  const expirationDate =
    expiresAt instanceof Date
      ? expiresAt
      : new Date(expiresAt)

  if (
    Number.isNaN(expirationDate.getTime())
  ) {
    throw new Error(
      "Administrative session expiration is invalid",
    )
  }

  const maxAgeSeconds = Math.max(
    0,
    Math.floor(
      (expirationDate.getTime() -
        Date.now()) /
        1000,
    ),
  )

  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=${encodeURIComponent(
      token,
    )}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAgeSeconds}`,
    `Expires=${expirationDate.toUTCString()}`,
    "Priority=High",
  ]

  if (shouldUseSecureCookie()) {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function serializeExpiredAdminSessionCookie() {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Priority=High",
  ]

  if (shouldUseSecureCookie()) {
    parts.push("Secure")
  }

  return parts.join("; ")
}

export function readAdminSessionToken(
  request,
) {
  const helperCookie =
    request?.cookies?.[
      ADMIN_SESSION_COOKIE_NAME
    ]

  if (helperCookie) {
    return String(helperCookie).trim()
  }

  const cookieHeader =
    request?.headers?.cookie ||
    request?.headers?.Cookie

  if (!cookieHeader) {
    return null
  }

  const cookies = String(cookieHeader)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)

  for (const cookie of cookies) {
    const separatorIndex =
      cookie.indexOf("=")

    if (separatorIndex < 0) {
      continue
    }

    const name = cookie
      .slice(0, separatorIndex)
      .trim()

    if (
      name !==
      ADMIN_SESSION_COOKIE_NAME
    ) {
      continue
    }

    const value = cookie.slice(
      separatorIndex + 1,
    )

    try {
      return decodeURIComponent(value).trim()
    } catch {
      return null
    }
  }

  return null
}