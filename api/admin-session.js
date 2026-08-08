import {
  authenticateAdminRequest,
  expireAdminSessionCookie,
  sendAdminJson,
  setAdminApiSecurityHeaders,
} from "./lib/admin/admin-request.js"

export default async function handler(
  request,
  response,
) {
  setAdminApiSecurityHeaders(response)

  if (request.method !== "GET") {
    response.setHeader(
      "Allow",
      "GET",
    )

    sendAdminJson(response, 405, {
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Método não permitido.",
    })

    return
  }

  try {
    const authentication =
      await authenticateAdminRequest(
        request,
      )

    if (!authentication) {
      expireAdminSessionCookie(
        response,
      )

      sendAdminJson(response, 401, {
        success: false,
        authenticated: false,

        error:
          "ADMIN_SESSION_REQUIRED",

        message:
          "Sessão administrativa não encontrada ou expirada.",
      })

      return
    }

    const {
      session,
    } = authentication

    sendAdminJson(response, 200, {
      success: true,
      authenticated: true,

      admin: {
        id: session.admin.id,
        email: session.admin.email,
        role: session.admin.role,

        mustChangePassword:
          session.admin
            .mustChangePassword,
      },

      session: {
        id: session.id,
        expiresAt:
          session.expiresAt,
        createdAt:
          session.createdAt,
        lastSeenAt:
          session.lastSeenAt,
      },
    })
  } catch (error) {
    console.error(
      "[ADMIN SESSION] Validation failed:",
      {
        name: error?.name,
        message: error?.message,
      },
    )

    sendAdminJson(response, 500, {
      success: false,
      authenticated: false,

      error:
        "ADMIN_SESSION_UNAVAILABLE",

      message:
        "Não foi possível validar a sessão administrativa.",
    })
  }
}