class AdminApiError extends Error {
  constructor(
    message,
    {
      status = 0,
      code = null,
      data = null,
    } = {},
  ) {
    super(message)

    this.name = "AdminApiError"
    this.status = status
    this.code = code
    this.data = data
  }
}

async function parseResponseBody(
  response,
) {
  const contentType =
    response.headers.get(
      "content-type",
    ) || ""

  if (
    !contentType.includes(
      "application/json",
    )
  ) {
    return null
  }

  try {
    return await response.json()
  } catch {
    return null
  }
}

async function requestAdminApi(
  endpoint,
  {
    method = "GET",
    body,
    signal,
  } = {},
) {
  const headers = {
    Accept: "application/json",
  }

  const requestOptions = {
    method,
    headers,
    credentials: "include",
    cache: "no-store",
    signal,
  }

  if (body !== undefined) {
    headers["Content-Type"] =
      "application/json"

    requestOptions.body =
      JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(
      endpoint,
      requestOptions,
    )
  } catch (error) {
    if (
      error?.name === "AbortError"
    ) {
      throw error
    }

    throw new AdminApiError(
      "Não foi possível conectar ao serviço administrativo.",
      {
        code:
          "ADMIN_API_CONNECTION_FAILED",
      },
    )
  }

  const data =
    await parseResponseBody(
      response,
    )

  if (!response.ok) {
    throw new AdminApiError(
      data?.message ||
        "Não foi possível concluir a operação administrativa.",
      {
        status:
          response.status,

        code:
          data?.error ||
          "ADMIN_API_REQUEST_FAILED",

        data,
      },
    )
  }

  return data
}

export function getAdminSession({
  signal,
} = {}) {
  return requestAdminApi(
    "/api/admin-session",
    {
      method: "GET",
      signal,
    },
  )
}

export function getAdminOverview({
  signal,
} = {}) {
  return requestAdminApi(
    "/api/admin-overview",
    {
      method: "GET",
      signal,
    },
  )
}

export function getAdminCustomersPage({
  page = 1,
  pageSize = 20,
  signal,
} = {}) {
  const query =
    new URLSearchParams({
      page:
        String(page),

      pageSize:
        String(pageSize),
    })

  return requestAdminApi(
    `/api/admin-customers?${query.toString()}`,
    {
      method: "GET",
      signal,
    },
  )
}

export function getAdminAuditPage({
  page = 1,
  pageSize = 20,
  signal,
} = {}) {
  const query =
    new URLSearchParams({
      page:
        String(page),

      pageSize:
        String(pageSize),
    })

  return requestAdminApi(
    `/api/admin-audit?${query.toString()}`,
    {
      method: "GET",
      signal,
    },
  )
}

export function loginAdmin({
  email,
  password,
}) {
  return requestAdminApi(
    "/api/admin-login",
    {
      method: "POST",

      body: {
        email,
        password,
      },
    },
  )
}

export function logoutAdmin() {
  return requestAdminApi(
    "/api/admin-logout",
    {
      method: "POST",
    },
  )
}

export { AdminApiError }