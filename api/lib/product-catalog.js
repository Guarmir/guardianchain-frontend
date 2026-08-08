export const DEFAULT_CHECKOUT_PRODUCT_ID =
  "single-certificate"

export const SERVER_PRODUCT_CATALOG_VERSION =
  "1.1"

const checkoutProducts = {
  "single-certificate": {
    id: "single-certificate",
    type: "single",
    credits: 1,
    currency: "usd",
    unitAmount: 800,
    active: true,

    content: {
      pt: {
        name: "Certificado GuardianChain",
        description:
          "Registro de prova digital verificável com certificado, Evidence Key™ e QR Code",
      },

      en: {
        name: "GuardianChain Certificate",
        description:
          "Verifiable digital proof registration with certificate, Evidence Key™, and QR Code",
      },
    },
  },

  "package-5-records": {
    id: "package-5-records",
    type: "package",
    credits: 5,
    currency: "usd",
    unitAmount: 3500,
    active: false,

    content: {
      pt: {
        name:
          "Pacote GuardianChain com 5 registros",

        description:
          "Pacote com créditos para criar cinco provas digitais verificáveis",
      },

      en: {
        name:
          "GuardianChain 5-record package",

        description:
          "Credit package for creating five verifiable digital proofs",
      },
    },
  },

  "package-8-records": {
    id: "package-8-records",
    type: "package",
    credits: 8,
    currency: "usd",
    unitAmount: 5200,
    active: false,

    content: {
      pt: {
        name:
          "Pacote GuardianChain com 8 registros",

        description:
          "Pacote com créditos para criar oito provas digitais verificáveis",
      },

      en: {
        name:
          "GuardianChain 8-record package",

        description:
          "Credit package for creating eight verifiable digital proofs",
      },
    },
  },

  "package-12-records": {
    id: "package-12-records",
    type: "package",
    credits: 12,
    currency: "usd",
    unitAmount: 7200,
    active: false,

    content: {
      pt: {
        name:
          "Pacote GuardianChain com 12 registros",

        description:
          "Pacote com créditos para criar doze provas digitais verificáveis",
      },

      en: {
        name:
          "GuardianChain 12-record package",

        description:
          "Credit package for creating twelve verifiable digital proofs",
      },
    },
  },
}

function normalizeLanguage(language) {
  return language === "pt"
    ? "pt"
    : "en"
}

function mapProduct(
  product,
  language,
) {
  const normalizedLanguage =
    normalizeLanguage(language)

  return {
    id:
      product.id,

    type:
      product.type,

    credits:
      product.credits,

    currency:
      product.currency,

    unitAmount:
      product.unitAmount,

    active:
      product.active,

    catalogVersion:
      SERVER_PRODUCT_CATALOG_VERSION,

    ...product.content[
      normalizedLanguage
    ],
  }
}

export function getProductCatalogEntryById(
  productId,
  language = "en",
) {
  const normalizedProductId =
    productId ||
    DEFAULT_CHECKOUT_PRODUCT_ID

  const product =
    checkoutProducts[
      normalizedProductId
    ]

  if (!product) {
    return null
  }

  return mapProduct(
    product,
    language,
  )
}

export function getCheckoutProductById(
  productId,
  language = "en",
) {
  const product =
    getProductCatalogEntryById(
      productId,
      language,
    )

  if (
    !product ||
    !product.active ||
    !Number.isInteger(
      product.unitAmount,
    ) ||
    product.unitAmount <= 0 ||
    !Number.isInteger(
      product.credits,
    ) ||
    product.credits <= 0
  ) {
    return null
  }

  return product
}