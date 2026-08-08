import {
  authenticateAdminRequest,
  expireAdminSessionCookie,
  sendAdminJson,
  setAdminApiSecurityHeaders,
} from "./lib/admin/admin-request.js"

import {
  getAdminCustomersPage,
} from "./lib/admin/admin-customers-repository.js"

function readQueryValue(
  request,
  parameterName,
) {
  const directValue =
    request?.query?.[
      parameterName
    ]

  if (Array.isArray(directValue)) {
    return directValue[0]
  }

  if (
    directValue !== undefined &&
    directValue !== null
  ) {
    return directValue
  }

  try {
    const requestUrl = new URL(
      request.url,
      "http://localhost",
    )

    return requestUrl.searchParams.get(
      parameterName,
    )
  } catch {
    return null
  }
}

export default async function handler(
  request,
  response,
) {
  setAdminApiSecurityHeaders(
    response,
  )

  if (request.method !== "GET") {
    response.setHeader(
      "Allow",
      "GET",
    )

    sendAdminJson(response, 405, {
      success: false,

      error:
        "METHOD_NOT_ALLOWED",

      message:
        "Método não permitido.",
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

    const result =
      await getAdminCustomersPage({
        page:
          readQueryValue(
            request,
            "page",
          ),

        pageSize:
          readQueryValue(
            request,
            "pageSize",
          ),
      })

    sendAdminJson(response, 200, {
      success: true,
      customers: result,
    })
  } catch (error) {
    console.error(
      "[ADMIN CUSTOMERS] Loading failed:",
      {
        name:
          error?.name,

        message:
          error?.message,
      },
    )

    sendAdminJson(response, 500, {
      success: false,

      error:
        "ADMIN_CUSTOMERS_UNAVAILABLE",

      message:
        "Não foi possível carregar os clientes.",
    })
  }
}