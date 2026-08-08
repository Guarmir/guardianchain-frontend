import crypto from "crypto"

function normalizeCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
}

function resolveEvidenceKeySecret() {
  const secret =
    process.env.EVIDENCE_KEY_SECRET ||
    process.env.EMAIL_VERIFICATION_SECRET ||
    process.env.STRIPE_SECRET_KEY

  if (!secret) {
    throw new Error("Evidence Key secret is not configured")
  }

  return secret
}

function resolveIssuedYear(issuedAt) {
  const numericIssuedAt = Number(issuedAt)

  if (!Number.isFinite(numericIssuedAt) || numericIssuedAt <= 0) {
    return "0000"
  }

  const issuedDate = new Date(numericIssuedAt * 1000)

  if (Number.isNaN(issuedDate.getTime())) {
    return "0000"
  }

  return String(issuedDate.getUTCFullYear())
}

export function generateEvidenceKey({
  paymentId = "",
  fileHash = "",
  language = "en",
  issuedAt = null,
}) {
  if (!fileHash) {
    throw new Error("File hash is required to generate Evidence Key")
  }

  const normalizedLanguage = language === "pt" ? "pt" : "en"
  const market = normalizedLanguage === "pt" ? "BR" : "EN"

  const normalizedPaymentId =
    normalizeCode(paymentId) || "NOPAYMENT"

  const normalizedHash = normalizeCode(fileHash)

  const paymentPart = normalizedPaymentId
    .slice(-6)
    .padStart(6, "0")

  const hashPart = normalizedHash
    .slice(0, 6)
    .padEnd(6, "0")

  const issuedYear = resolveIssuedYear(issuedAt)

  const issuedAtPart =
    Number.isFinite(Number(issuedAt)) && Number(issuedAt) > 0
      ? String(Number(issuedAt))
      : "UNKNOWN"

  const payload = [
    normalizedPaymentId,
    normalizedHash,
    normalizedLanguage,
    issuedAtPart,
  ].join("|")

  const signaturePart = crypto
    .createHmac("sha256", resolveEvidenceKeySecret())
    .update(payload)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase()

  return [
    "GC",
    issuedYear,
    market,
    paymentPart,
    hashPart,
    signaturePart,
  ].join("-")
}