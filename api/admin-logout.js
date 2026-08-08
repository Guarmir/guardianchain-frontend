import {
  authenticateAdminRequest,
  expireAdminSessionCookie,
  sendAdminJson,
  setAdminApiSecurityHeaders,
} from "./lib/admin/admin-request.js"

import {
  revokeAdminSessionByTokenHash,
} from "./lib/admin/admin-session-repository.js"

export default async function handler(
  request,
  response,
) {
  setAdminApiSecurityHeaders(response)

  if (request.method !== "POST") {
    response.setHeader(
      "Allow",
      "POST",
    )

    sendAdminJson(response, 405, {
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Método não permitido.",
    })

    return
  }

  expireAdminSessionCookie(response)

  try {
    const authentication =
      await authenticateAdminRequest(
        request,
        {
          touch: false,
        },
      )

    if (authentication) {
      await revokeAdminSessionByTokenHash({
        tokenHash:
          authentication.tokenHash,

        ipAddress:
          authentication.ipAddress,

        userAgent:
          authentication.userAgent,
      })
    }

    sendAdminJson(response, 200, {
      success: true,
      authenticated: false,

      message:
        "Sessão administrativa encerrada.",
    })
  } catch (error) {
    console.error(
      "[ADMIN LOGOUT] Logout failed:",
      {
        name: error?.name,
        message: error?.message,
      },
    )

    sendAdminJson(response, 500, {
      success: false,

      error:
        "ADMIN_LOGOUT_UNAVAILABLE",

      message:
        "Não foi possível concluir o encerramento da sessão.",
    })
  }
}