import {
  getDatabaseClient,
} from "../api/lib/db.js"

import {
  generateOpaqueAccessToken,
  generateRecoveryCode,
  hashCertificateAccessKey,
  hashOpaqueAccessToken,
  hashRecoveryCode,
  verifyCertificateAccessKey,
  verifyOpaqueAccessToken,
  verifyRecoveryCode,
} from "../api/lib/certificate-access-crypto.js"

const EXPECTED_TABLES = [
  "gc_certificate_access_credentials",
  "gc_certificate_access_tokens",
  "gc_certificate_access_sessions",
  "gc_certificate_access_events",
]

async function validateDatabaseStructure() {
  const sql =
    getDatabaseClient()

  const tableRows =
    await sql`
      SELECT
        table_name

      FROM information_schema.tables

      WHERE
        table_schema = 'public'

        AND table_name IN (
          'gc_certificate_access_credentials',
          'gc_certificate_access_tokens',
          'gc_certificate_access_sessions',
          'gc_certificate_access_events'
        )

      ORDER BY table_name
    `

  const tableNames =
    tableRows.map(
      (row) =>
        row.table_name,
    )

  const missingTables =
    EXPECTED_TABLES.filter(
      (tableName) =>
        !tableNames.includes(
          tableName,
        ),
    )

  if (
    missingTables.length > 0
  ) {
    throw new Error(
      `Missing certificate access tables: ${missingTables.join(", ")}`,
    )
  }

  const certificateRows =
    await sql`
      SELECT
        COUNT(*)::INTEGER
          AS total

      FROM gc_certificates
    `

  const credentialRows =
    await sql`
      SELECT
        COUNT(*)::INTEGER
          AS total

      FROM gc_certificate_access_credentials
    `

  const certificateCount =
    Number(
      certificateRows[0]
        ?.total ||
      0,
    )

  const credentialCount =
    Number(
      credentialRows[0]
        ?.total ||
      0,
    )

  if (
    certificateCount !==
    credentialCount
  ) {
    throw new Error(
      "Certificate access credential count does not match certificate count",
    )
  }

  const triggerRows =
    await sql`
      SELECT
        trigger_name

      FROM information_schema.triggers

      WHERE
        event_object_schema =
          'public'

        AND event_object_table =
          'gc_certificates'

        AND trigger_name =
          'gc_certificates_access_credential_trigger'
    `

  if (
    triggerRows.length !== 1
  ) {
    throw new Error(
      "Certificate access credential trigger is missing",
    )
  }

  console.log(
    "[CERTIFICATE ACCESS CHECK] Database structure valid:",
    {
      tables:
        tableNames.length,

      certificates:
        certificateCount,

      credentials:
        credentialCount,

      trigger:
        triggerRows[0]
          ?.trigger_name,
    },
  )
}

async function validateCryptography() {
  const sampleAccessKey =
    "GuardianChain-Test-2026!"

  const protectedKey =
    await hashCertificateAccessKey(
      sampleAccessKey,
    )

  const validKey =
    await verifyCertificateAccessKey({
      accessKey:
        sampleAccessKey,

      keyHash:
        protectedKey.keyHash,

      keySalt:
        protectedKey.keySalt,

      keyAlgorithm:
        protectedKey
          .keyAlgorithm,
    })

  const invalidKey =
    await verifyCertificateAccessKey({
      accessKey:
        "GuardianChain-Wrong-2026!",

      keyHash:
        protectedKey.keyHash,

      keySalt:
        protectedKey.keySalt,

      keyAlgorithm:
        protectedKey
          .keyAlgorithm,
    })

  if (
    !validKey ||
    invalidKey
  ) {
    throw new Error(
      "Certificate access key verification failed",
    )
  }

  const recoveryCode =
    generateRecoveryCode()

  const recoveryCodeHash =
    hashRecoveryCode(
      recoveryCode,
    )

  if (
    !verifyRecoveryCode({
      recoveryCode,

      recoveryCodeHash,
    })
  ) {
    throw new Error(
      "Recovery code verification failed",
    )
  }

  const opaqueToken =
    generateOpaqueAccessToken()

  const opaqueTokenHash =
    hashOpaqueAccessToken(
      opaqueToken,
    )

  if (
    !verifyOpaqueAccessToken({
      token:
        opaqueToken,

      tokenHash:
        opaqueTokenHash,
    })
  ) {
    throw new Error(
      "Opaque token verification failed",
    )
  }

  console.log(
    "[CERTIFICATE ACCESS CHECK] Cryptography valid:",
    {
      accessKey:
        true,

      recoveryCode:
        true,

      opaqueToken:
        true,
    },
  )
}

async function runCheck() {
  console.log(
    "[CERTIFICATE ACCESS CHECK] Starting...",
  )

  await validateDatabaseStructure()

  await validateCryptography()

  console.log(
    "[CERTIFICATE ACCESS CHECK] GuardianChain certificate access foundation is valid.",
  )
}

runCheck().catch(
  (error) => {
    console.error(
      "[CERTIFICATE ACCESS CHECK] Validation failed:",
      error,
    )

    process.exitCode = 1
  },
)