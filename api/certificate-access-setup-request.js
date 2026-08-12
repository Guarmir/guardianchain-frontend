import {
  requestCertificateAccessSetup,
} from "./lib/certificate-access-setup-request-service.js"

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

    await requestCertificateAccessSetup({
      evidenceKey,
    })

    /*
     * Same response regardless of whether the
     * Evidence Key exists. Prevents enumeration.
     */
    return response
      .status(200)
      .json({
        requested:
          true,

        message:
          "If the certificate is eligible for access setup, a new link will be sent to the registered email address.",
      })
  } catch (error) {
    console.error(
      "[CERTIFICATE ACCESS SETUP REQUEST] Error:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    return response
      .status(500)
      .json({
        error:
          "Setup link request could not be processed",
      })
  }
}