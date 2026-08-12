import {
  CERTIFICATE_ACCESS_SESSION_TTL_MS,
  CERTIFICATE_SETUP_TOKEN_TTL_MS,
  generateOpaqueAccessToken,
  generateRecoveryCode,
  hashCertificateAccessKey,
  hashOpaqueAccessToken,
  hashRecoveryCode,
  verifyCertificateAccessKey,
} from "./certificate-access-crypto.js"

import {
  activateCertificateAccess,
  createCertificateAccessSession,
  createCertificateSetupToken,
  getCertificateAccessAuthenticationState,
  getCertificateForAuthorizedSession,
  recordCertificateAccessBlocked,
  recordCertificateAccessFailure,
} from "./certificate-access-repository.js"

function createAccessError(
  code,
  message,
) {
  const error =
    new Error(message)

  error.code = code

  return error
}

export async function issueCertificateSetupToken({
  certificateId,
}) {
  const token =
    generateOpaqueAccessToken()

  const tokenHash =
    hashOpaqueAccessToken(
      token,
    )

  const expiresAt =
    new Date(
      Date.now() +
        CERTIFICATE_SETUP_TOKEN_TTL_MS,
    ).toISOString()

  const tokenRecord =
    await createCertificateSetupToken({
      certificateId,
      tokenHash,
      expiresAt,
    })

  return {
    token,

    certificateId:
      tokenRecord
        .certificateId,

    expiresAt:
      tokenRecord
        .expiresAt,
  }
}

export async function configureCertificateAccess({
  setupToken,
  accessKey,
  userAgent = null,
}) {
  const normalizedSetupToken =
    String(
      setupToken || "",
    ).trim()

  if (
    !normalizedSetupToken
  ) {
    throw new Error(
      "Setup token is required",
    )
  }

  const protectedAccessKey =
    await hashCertificateAccessKey(
      accessKey,
    )

  const recoveryCode =
    generateRecoveryCode()

  const recoveryCodeHash =
    hashRecoveryCode(
      recoveryCode,
    )

  const setupTokenHash =
    hashOpaqueAccessToken(
      normalizedSetupToken,
    )

  const certificate =
    await activateCertificateAccess({
      tokenHash:
        setupTokenHash,

      keyHash:
        protectedAccessKey
          .keyHash,

      keySalt:
        protectedAccessKey
          .keySalt,

      keyAlgorithm:
        protectedAccessKey
          .keyAlgorithm,

      recoveryCodeHash,

      userAgent,
    })

  return {
    certificate,
    recoveryCode,
  }
}

export async function authenticateCertificateAccess({
  evidenceKey,
  accessKey,
  userAgent = null,
}) {
  const normalizedEvidenceKey =
    String(
      evidenceKey || "",
    )
      .trim()
      .toUpperCase()

  const normalizedAccessKey =
    String(
      accessKey || "",
    )

  if (
    !normalizedEvidenceKey ||
    !normalizedAccessKey
  ) {
    throw createAccessError(
      "INVALID_REQUEST",
      "Evidence Key and Access Key are required",
    )
  }

  const state =
    await getCertificateAccessAuthenticationState({
      evidenceKey:
        normalizedEvidenceKey,
    })

  if (!state) {
    throw createAccessError(
      "INVALID_ACCESS",
      "Certificate access could not be validated",
    )
  }

  if (
    state.certificateStatus !==
      "active" ||
    state.customerStatus !==
      "active"
  ) {
    throw createAccessError(
      "ACCESS_UNAVAILABLE",
      "Certificate access is not available",
    )
  }

  if (
    state.accessStatus ===
      "setup_required"
  ) {
    throw createAccessError(
      "SETUP_REQUIRED",
      "Certificate Access Key has not been configured",
    )
  }

  if (
    state.accessStatus !==
      "active"
  ) {
    throw createAccessError(
      "ACCESS_UNAVAILABLE",
      "Certificate access is not available",
    )
  }

  if (
    state.lockedUntil &&
    new Date(
      state.lockedUntil,
    ).getTime() >
      Date.now()
  ) {
    await recordCertificateAccessBlocked({
      certificateId:
        state.certificateId,

      userAgent,
    })

    throw createAccessError(
      "ACCESS_LOCKED",
      "Certificate access is temporarily locked",
    )
  }

  const validAccessKey =
    await verifyCertificateAccessKey({
      accessKey:
        normalizedAccessKey,

      keyHash:
        state.keyHash,

      keySalt:
        state.keySalt,

      keyAlgorithm:
        state.keyAlgorithm,
    })

  if (
    !validAccessKey
  ) {
    const failure =
      await recordCertificateAccessFailure({
        certificateId:
          state.certificateId,

        userAgent,
      })

    if (
      failure.lockedUntil
    ) {
      throw createAccessError(
        "ACCESS_LOCKED",
        "Certificate access is temporarily locked",
      )
    }

    throw createAccessError(
      "INVALID_ACCESS_KEY",
      "Access Key is invalid",
    )
  }

  const sessionToken =
    generateOpaqueAccessToken()

  const sessionTokenHash =
    hashOpaqueAccessToken(
      sessionToken,
    )

  const expiresAt =
    new Date(
      Date.now() +
        CERTIFICATE_ACCESS_SESSION_TTL_MS,
    ).toISOString()

  const accessSession =
    await createCertificateAccessSession({
      certificateId:
        state.certificateId,

      sessionTokenHash,

      accessVersion:
        state.accessVersion,

      expiresAt,

      userAgent,
    })

  return {
    sessionToken,

    expiresAt:
      accessSession
        .expiresAt,

    certificate: {
      id:
        state.certificateId,

      evidenceKey:
        state.evidenceKey,
    },
  }
}

export async function authorizeCertificateSession({
  evidenceKey,
  sessionToken,
}) {
  const normalizedSessionToken =
    String(
      sessionToken || "",
    ).trim()

  if (
    !normalizedSessionToken
  ) {
    return null
  }

  const sessionTokenHash =
    hashOpaqueAccessToken(
      normalizedSessionToken,
    )

  return await getCertificateForAuthorizedSession({
    evidenceKey,
    sessionTokenHash,
  })
}