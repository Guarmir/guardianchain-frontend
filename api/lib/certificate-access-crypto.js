import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"

import {
  promisify,
} from "node:util"

const scrypt =
  promisify(
    scryptCallback,
  )

export const CERTIFICATE_ACCESS_KEY_ALGORITHM =
  "scrypt-v1"

export const CERTIFICATE_SETUP_TOKEN_TTL_MS =
  24 * 60 * 60 * 1000

export const CERTIFICATE_RECOVERY_TOKEN_TTL_MS =
  30 * 60 * 1000

export const CERTIFICATE_ACCESS_SESSION_TTL_MS =
  15 * 60 * 1000

const KEY_LENGTH = 64

const SCRYPT_OPTIONS =
  Object.freeze({
    N: 32768,
    r: 8,
    p: 1,
    maxmem:
      128 *
      1024 *
      1024,
  })

function getCertificateAccessPepper() {
  const pepper =
    String(
      process.env
        .CERTIFICATE_ACCESS_PEPPER ||
      "",
    ).trim()

  if (
    pepper.length < 32
  ) {
    throw new Error(
      "CERTIFICATE_ACCESS_PEPPER must contain at least 32 characters",
    )
  }

  return pepper
}

export function validateCertificateAccessKey(
  value,
) {
  const accessKey =
    String(
      value || "",
    )

  const errors = []

  if (
    accessKey.length < 14
  ) {
    errors.push(
      "The access key must contain at least 14 characters",
    )
  }

  if (
    accessKey.length > 128
  ) {
    errors.push(
      "The access key cannot exceed 128 characters",
    )
  }

  if (
    !/[a-z]/.test(
      accessKey,
    )
  ) {
    errors.push(
      "The access key must contain a lowercase letter",
    )
  }

  if (
    !/[A-Z]/.test(
      accessKey,
    )
  ) {
    errors.push(
      "The access key must contain an uppercase letter",
    )
  }

  if (
    !/[0-9]/.test(
      accessKey,
    )
  ) {
    errors.push(
      "The access key must contain a number",
    )
  }

  if (
    !/[^A-Za-z0-9]/.test(
      accessKey,
    )
  ) {
    errors.push(
      "The access key must contain a special character",
    )
  }

  return {
    valid:
      errors.length === 0,

    errors,
  }
}

function buildAccessKeyMaterial(
  accessKey,
) {
  return [
    String(accessKey),
    getCertificateAccessPepper(),
  ].join(
    "\u0000",
  )
}

export async function hashCertificateAccessKey(
  accessKey,
) {
  const validation =
    validateCertificateAccessKey(
      accessKey,
    )

  if (
    !validation.valid
  ) {
    throw new Error(
      validation.errors.join(
        ". ",
      ),
    )
  }

  const keySalt =
    randomBytes(32)
      .toString("hex")

  const derivedKey =
    await scrypt(
      buildAccessKeyMaterial(
        accessKey,
      ),
      keySalt,
      KEY_LENGTH,
      SCRYPT_OPTIONS,
    )

  return {
    keyHash:
      Buffer.from(
        derivedKey,
      ).toString(
        "hex",
      ),

    keySalt,

    keyAlgorithm:
      CERTIFICATE_ACCESS_KEY_ALGORITHM,
  }
}

export async function verifyCertificateAccessKey({
  accessKey,
  keyHash,
  keySalt,
  keyAlgorithm,
}) {
  if (
    keyAlgorithm !==
      CERTIFICATE_ACCESS_KEY_ALGORITHM ||
    !keyHash ||
    !keySalt
  ) {
    return false
  }

  const storedKey =
    Buffer.from(
      keyHash,
      "hex",
    )

  if (
    storedKey.length !==
    KEY_LENGTH
  ) {
    return false
  }

  const candidateKey =
    await scrypt(
      buildAccessKeyMaterial(
        accessKey,
      ),
      keySalt,
      KEY_LENGTH,
      SCRYPT_OPTIONS,
    )

  return timingSafeEqual(
    storedKey,
    Buffer.from(
      candidateKey,
    ),
  )
}

export function generateOpaqueAccessToken() {
  return randomBytes(32)
    .toString(
      "base64url",
    )
}

export function hashOpaqueAccessToken(
  token,
) {
  return createHash(
    "sha256",
  )
    .update(
      String(
        token || "",
      ),
      "utf8",
    )
    .digest(
      "hex",
    )
}

export function verifyOpaqueAccessToken({
  token,
  tokenHash,
}) {
  if (
    !token ||
    !/^[0-9a-f]{64}$/.test(
      String(
        tokenHash || "",
      ),
    )
  ) {
    return false
  }

  const candidateHash =
    Buffer.from(
      hashOpaqueAccessToken(
        token,
      ),
      "hex",
    )

  const expectedHash =
    Buffer.from(
      tokenHash,
      "hex",
    )

  return timingSafeEqual(
    candidateHash,
    expectedHash,
  )
}

function normalizeRecoveryCode(
  recoveryCode,
) {
  return String(
    recoveryCode || "",
  )
    .trim()
    .toUpperCase()
    .replace(
      /[^A-Z0-9]/g,
      "",
    )
}

export function generateRecoveryCode() {
  const randomPart =
    randomBytes(16)
      .toString("hex")
      .toUpperCase()

  const groups =
    randomPart.match(
      /.{1,4}/g,
    ) || []

  return [
    "GCR",
    ...groups,
  ].join("-")
}

export function hashRecoveryCode(
  recoveryCode,
) {
  const normalizedCode =
    normalizeRecoveryCode(
      recoveryCode,
    )

  if (
    !/^GCR[0-9A-F]{32}$/.test(
      normalizedCode,
    )
  ) {
    throw new Error(
      "Invalid recovery code",
    )
  }

  return createHash(
    "sha256",
  )
    .update(
      normalizedCode,
      "utf8",
    )
    .digest(
      "hex",
    )
}

export function verifyRecoveryCode({
  recoveryCode,
  recoveryCodeHash,
}) {
  if (
    !recoveryCode ||
    !/^[0-9a-f]{64}$/.test(
      String(
        recoveryCodeHash ||
        "",
      ),
    )
  ) {
    return false
  }

  let candidateHash

  try {
    candidateHash =
      hashRecoveryCode(
        recoveryCode,
      )
  } catch {
    return false
  }

  return timingSafeEqual(
    Buffer.from(
      candidateHash,
      "hex",
    ),
    Buffer.from(
      recoveryCodeHash,
      "hex",
    ),
  )
}