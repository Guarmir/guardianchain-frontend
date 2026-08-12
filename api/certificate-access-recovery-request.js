import {
  requestCertificateAccessRecovery,
} from "./lib/certificate-access-recovery-service.js"

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

    const evidenceKey =
      String(
        body.evidenceKey ||
          "",
      ).trim()

    if (!evidenceKey) {
      return response
        .status(400)
        .json({
          error:
            "Evidence Key is required",
        })
    }

    await requestCertificateAccessRecovery({
      evidenceKey,
    })

    /*
     * Always return the same response.
     * This prevents certificate/account enumeration.
     */
    return response
      .status(200)
      .json({
        requested:
          true,

        message:
          "If the certificate is eligible for recovery, instructions will be sent to the registered email address.",
      })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS RECOVERY REQUEST] Error:",
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
            "Evidence Key is required",
        })
    }

    return response
      .status(500)
      .json({
        error:
          "Recovery request could not be processed",
      })
  }
}