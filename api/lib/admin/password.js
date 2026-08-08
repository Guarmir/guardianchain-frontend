import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)

export const ADMIN_PASSWORD_ALGORITHM = "scrypt-v1"

const KEY_LENGTH = 64

const SCRYPT_OPTIONS = Object.freeze({
  N: 32768,
  r: 8,
  p: 1,
  maxmem: 128 * 1024 * 1024,
})

function getAdminAuthPepper() {
  const pepper = String(
    process.env.ADMIN_AUTH_PEPPER || "",
  ).trim()

  if (pepper.length < 32) {
    throw new Error(
      "ADMIN_AUTH_PEPPER must contain at least 32 characters",
    )
  }

  return pepper
}

export function normalizeAdminEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
}

export function validateAdminEmail(value) {
  const email = normalizeAdminEmail(value)

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateAdminPassword(value) {
  const password = String(value || "")
  const errors = []

  if (password.length < 14) {
    errors.push(
      "The administrative password must contain at least 14 characters",
    )
  }

  if (password.length > 128) {
    errors.push(
      "The administrative password cannot exceed 128 characters",
    )
  }

  if (!/[a-z]/.test(password)) {
    errors.push(
      "The administrative password must contain a lowercase letter",
    )
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(
      "The administrative password must contain an uppercase letter",
    )
  }

  if (!/[0-9]/.test(password)) {
    errors.push(
      "The administrative password must contain a number",
    )
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(
      "The administrative password must contain a special character",
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function buildPasswordMaterial(password) {
  return [
    String(password),
    getAdminAuthPepper(),
  ].join("\u0000")
}

export async function hashAdminPassword(password) {
  const validation = validateAdminPassword(password)

  if (!validation.valid) {
    throw new Error(validation.errors.join(". "))
  }

  const passwordSalt = randomBytes(32).toString("hex")

  const derivedKey = await scrypt(
    buildPasswordMaterial(password),
    passwordSalt,
    KEY_LENGTH,
    SCRYPT_OPTIONS,
  )

  return {
    passwordHash:
      Buffer.from(derivedKey).toString("hex"),

    passwordSalt,

    passwordAlgorithm:
      ADMIN_PASSWORD_ALGORITHM,
  }
}

export async function verifyAdminPassword({
  password,
  passwordHash,
  passwordSalt,
  passwordAlgorithm,
}) {
  if (
    passwordAlgorithm !==
    ADMIN_PASSWORD_ALGORITHM
  ) {
    return false
  }

  if (!passwordHash || !passwordSalt) {
    return false
  }

  const storedKey = Buffer.from(
    passwordHash,
    "hex",
  )

  if (storedKey.length !== KEY_LENGTH) {
    return false
  }

  const candidateKey = await scrypt(
    buildPasswordMaterial(password),
    passwordSalt,
    KEY_LENGTH,
    SCRYPT_OPTIONS,
  )

  return timingSafeEqual(
    storedKey,
    Buffer.from(candidateKey),
  )
}