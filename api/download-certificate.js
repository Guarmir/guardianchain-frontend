export default async function handler(
  request,
  response,
) {
  response.setHeader(
    "Cache-Control",
    "no-store, max-age=0",
  )

  response.setHeader(
    "X-Content-Type-Options",
    "nosniff",
  )

  if (
    request.method !==
      "GET"
  ) {
    response.setHeader(
      "Allow",
      "GET",
    )

    return response
      .status(405)
      .json({
        error:
          "Method not allowed",
      })
  }

  return response
    .status(410)
    .json({
      error:
        "Direct certificate download is no longer available.",

      protectedAccessRequired:
        true,

      accessPath:
        "/certificate-access",
    })
}