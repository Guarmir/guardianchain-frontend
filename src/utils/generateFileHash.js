export async function generateFileHash(file) {
  if (!(file instanceof Blob)) {
    throw new TypeError("A valid file is required")
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error("SHA-256 is not supported by this browser")
  }

  const fileBuffer = await file.arrayBuffer()

  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    fileBuffer,
  )

  const hashBytes = Array.from(new Uint8Array(hashBuffer))

  const hexadecimalHash = hashBytes
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  return `0x${hexadecimalHash}`
}