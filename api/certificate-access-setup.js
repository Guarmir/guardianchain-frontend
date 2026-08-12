import {
  configureCertificateAccess,
} from "./lib/certificate-access-service.js"

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

  try {
    const body =
      getRequestBody(
        request,
      )

    const setupToken =
      String(
        body.setupToken ||
        body.token ||
        "",
      ).trim()

    const accessKey =
      String(
        body.accessKey ||
        "",
      )

    if (
      !setupToken ||
      !accessKey
    ) {
      return response
        .status(400)
        .json({
          error:
            "Setup token and access key are required",
        })
    }

    const result =
      await configureCertificateAccess({
        setupToken,
        accessKey,

        userAgent:
          getUserAgent(
            request,
          ),
      })

    return response
      .status(200)
      .json({
        configured:
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

          fileName:
            result
              .certificate
              .fileName,

          accessVersion:
            result
              .certificate
              .accessVersion,

          configuredAt:
            result
              .certificate
              .configuredAt,
        },

        recoveryCode:
          result.recoveryCode,

        recoveryCodeShownOnce:
          true,
      })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS SETUP] Error:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    const message =
      String(
        error?.message ||
        "",
      )

    if (
      message.includes(
        "at least 14 characters",
      ) ||
      message.includes(
        "lowercase",
      ) ||
      message.includes(
        "uppercase",
      ) ||
      message.includes(
        "number",
      ) ||
      message.includes(
        "special character",
      ) ||
      message.includes(
        "cannot exceed",
      )
    ) {
      return response
        .status(400)
        .json({
          error:
            message,
        })
    }

    return response
      .status(400)
      .json({
        error:
          "The certificate access setup link is invalid, expired, or no longer available",
      })
  }
}