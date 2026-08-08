import { isIP } from "node:net"

import {
  hashAdminSessionToken,
  readAdminSessionToken,
  serializeExpiredAdminSessionCookie,
} from "./admin-session.js"

import {
  resolveActiveAdminSession,
} from "./admin-session-repository.js"

export function setAdminApiSecurityHeaders(
  response,
) {
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

  response.setHeader(
    "X-Frame-Options",
    "DENY",
  )

  response.setHeader(
    "Referrer-Policy",
    "no-referrer",
  )
}

export function sendAdminJson(
  response,
  statusCode,
  body,
) {
  response.statusCode = statusCode

  response.end(
    JSON.stringify(body),
  )
}

function readHeader(request, name) {
  const value =
    request?.headers?.[
      name.toLowerCase()
    ] ??
    request?.headers?.[name]

  if (Array.isArray(value)) {
    return value[0] || ""
  }

  return String(value || "")
}

export function getAdminClientIpAddress(
  request,
) {
  const forwardedFor = readHeader(
    request,
    "x-forwarded-for",
  )

  const realIp = readHeader(
    request,
    "x-real-ip",
  )

  const socketIp = String(
    request?.socket?.remoteAddress || "",
  )

  const candidate = String(
    forwardedFor ||
      realIp ||
      socketIp ||
      "",
  )
    .split(",")[0]
    .trim()

  return isIP(candidate)
    ? candidate
    : null
}

export function getAdminUserAgent(
  request,
) {
  return (
    readHeader(
      request,
      "user-agent",
    )
      .trim()
      .slice(0, 512) || null
  )
}

export function expireAdminSessionCookie(
  response,
) {
  response.setHeader(
    "Set-Cookie",
    serializeExpiredAdminSessionCookie(),
  )
}

export async function authenticateAdminRequest(
  request,
  {
    touch = true,
  } = {},
) {
  const token =
    readAdminSessionToken(request)

  if (!token) {
    return null
  }

  const tokenHash =
    hashAdminSessionToken(token)

  if (!tokenHash) {
    return null
  }

  const session =
    await resolveActiveAdminSession({
      tokenHash,
      touch,
    })

  if (!session) {
    return null
  }

  return {
    tokenHash,
    session,

    ipAddress:
      getAdminClientIpAddress(
        request,
      ),

    userAgent:
      getAdminUserAgent(request),
  }
}