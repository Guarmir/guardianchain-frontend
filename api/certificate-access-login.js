import {
  authenticateCertificateAccess,
} from "./lib/certificate-access-service.js"

const COOKIE_NAME =
  "gc_certificate_access"

function getRequestBody(
  request,
) {
  if (
    request.body &&
    typeof request.body ===
      "object"
  ) {
    return request.body
  }

  if (
    typeof request.body ===
      "string"
  ) {
    try {
      return JSON.parse(
        request.body,
      )
    } catch {
      return {}
    }
  }

  return {}
}

function getUserAgent(
  request,
) {
  return String(
    request.headers[
      "user-agent"
    ] || "",
  )
    .trim()
    .slice(
      0,
      1000,
    )
}

function isProduction() {
  return (
    process.env.VERCEL_ENV ===
      "production" ||
    process.env.NODE_ENV ===
      "production"
  )
}

function buildAccessCookie(
  token,
) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(
      token,
    )}`,

    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=900",
  ]

  if (
    isProduction()
  ) {
    parts.push(
      "Secure",
    )
  }

  return parts.join("; ")
}

export default async function handler(
  request,
  response,
) {
  if (
    request.method !==
      "POST"
  ) {
    response.setHeader(
      "Allow",
      "POST",
    )

    return response
      .status(405)
      .json({
        error:
          "Method not allowed",
      })
  }

  response.setHeader(
    "Cache-Control",
    "no-store",
  )

  try {
    const body =
      getRequestBody(
        request,
      )

    const result =
      await authenticateCertificateAccess({
        evidenceKey:
          body.evidenceKey,

        accessKey:
          body.accessKey,

        userAgent:
          getUserAgent(
            request,
          ),
      })

    response.setHeader(
      "Set-Cookie",
      buildAccessCookie(
        result.sessionToken,
      ),
    )

    return response
      .status(200)
      .json({
        authenticated:
          true,

        evidenceKey:
          result
            .certificate
            .evidenceKey,

        expiresAt:
          result.expiresAt,

        sessionDurationMinutes:
          15,
      })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS LOGIN] Error:",
      {
        name:
          error?.name,

        code:
          error?.code,

        message:
          error?.message,
      },
    )

    if (
      error?.code ===
      "INVALID_REQUEST"
    ) {
      return response
        .status(400)
        .json({
          error:
            "Evidence Key and Access Key are required",
        })
    }

    if (
      error?.code ===
      "SETUP_REQUIRED"
    ) {
      return response
        .status(409)
        .json({
          error:
            "Certificate access protection has not been configured",
        })
    }

    if (
      error?.code ===
      "ACCESS_LOCKED"
    ) {
      return response
        .status(423)
        .json({
          error:
            "Access is temporarily locked after repeated failed attempts",
        })
    }

    if (
      error?.code ===
        "INVALID_ACCESS_KEY" ||
      error?.code ===
        "INVALID_ACCESS" ||
      error?.code ===
        "ACCESS_UNAVAILABLE"
    ) {
      return response
        .status(401)
        .json({
          error:
            "Certificate access could not be authenticated",
        })
    }

    return response
      .status(500)
      .json({
        error:
          "Certificate access authentication failed",
      })
  }
}