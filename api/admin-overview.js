import {
  authenticateAdminRequest,
  expireAdminSessionCookie,
  sendAdminJson,
  setAdminApiSecurityHeaders,
} from "./lib/admin/admin-request.js"

import {
  getAdminFoundationSnapshot,
} from "./lib/admin/admin-overview-repository.js"

function sanitizeProduct(product) {
  return {
    id: product.id,
    productType: product.productType,
    credits: product.credits,
    currency: product.currency,
    unitAmount: product.unitAmount,
    active: product.active,
    checkoutEnabled: product.checkoutEnabled,
    highlighted: product.highlighted,
    catalogVersion: product.catalogVersion,
    version: product.version,
  }
}

export default async function handler(
  request,
  response,
) {
  setAdminApiSecurityHeaders(response)

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET")

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
      expireAdminSessionCookie(response)

      sendAdminJson(response, 401, {
        success: false,
        authenticated: false,
        error: "ADMIN_SESSION_REQUIRED",
        message:
          "Sessão administrativa não encontrada ou expirada.",
      })

      return
    }

    const snapshot =
      await getAdminFoundationSnapshot()

    sendAdminJson(response, 200, {
      success: true,

      overview: {
        totals: snapshot.totals,

        products:
          snapshot.products.map(
            sanitizeProduct,
          ),

        salesByProduct:
          snapshot.salesByProduct,

        system: {
          administrativeTables:
            snapshot.tables.length,

          appliedMigrations:
            snapshot.migrations.length,

          generatedAt:
            new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    console.error(
      "[ADMIN OVERVIEW] Loading failed:",
      {
        name: error?.name,
        message: error?.message,
      },
    )

    sendAdminJson(response, 500, {
      success: false,
      error:
        "ADMIN_OVERVIEW_UNAVAILABLE",

      message:
        "Não foi possível carregar os dados administrativos.",
    })
  }
}