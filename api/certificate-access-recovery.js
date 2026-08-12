import {
  recoverCertificateAccess,
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
      await recoverCertificateAccess({
        recoveryToken:
          body.recoveryToken ||
          body.token,

        recoveryCode:
          body.recoveryCode,

        newAccessKey:
          body.newAccessKey,

        userAgent:
          getUserAgent(
            request,
          ),
      })

    return response
      .status(200)
      .json({
        recovered:
          true,

        certificate: {
          id:
            result
              .certificate
              .certificateId,

          evidenceKey:
            result
              .certificate
              .evidenceKey,

          accessVersion:
            result
              .certificate
              .accessVersion,

          recoveredAt:
            result
              .certificate
              .recoveredAt,
        },

        recoveryCode:
          result.recoveryCode,

        recoveryCodeShownOnce:
          true,

        previousSessionsInvalidated:
          true,
      })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS RECOVERY] Error:",
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
            "Recovery token, Recovery Code and new Access Key are required",
        })
    }

    if (
      error?.code ===
      "RECOVERY_BLOCKED"
    ) {
      return response
        .status(423)
        .json({
          error:
            "Recovery was blocked after repeated failed attempts",
        })
    }

    const validationMessage =
      String(
        error?.message ||
          "",
      )

    if (
      validationMessage.includes(
        "at least 14 characters",
      ) ||
      validationMessage.includes(
        "lowercase",
      ) ||
      validationMessage.includes(
        "uppercase",
      ) ||
      validationMessage.includes(
        "number",
      ) ||
      validationMessage.includes(
        "special character",
      ) ||
      validationMessage.includes(
        "cannot exceed",
      )
    ) {
      return response
        .status(400)
        .json({
          error:
            validationMessage,
        })
    }

    return response
      .status(400)
      .json({
        error:
          "The recovery link or Recovery Code is invalid, expired, or no longer available",
      })
  }
}