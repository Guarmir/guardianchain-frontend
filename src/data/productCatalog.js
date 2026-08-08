const DEFAULT_LANGUAGE = "en"
const SUPPORTED_LANGUAGES = ["pt", "en"]

export const PRODUCT_CURRENCY = "USD"
export const DEFAULT_PRODUCT_ID = "single-certificate"
export const PRODUCT_CATALOG_VERSION = "1.1"

export const productCatalog = {
  version: PRODUCT_CATALOG_VERSION,
  currency: PRODUCT_CURRENCY,

  single: {
    id: DEFAULT_PRODUCT_ID,
    type: "single",
    credits: 1,
    priceInCents: 800,
    active: true,
    checkoutEnabled: true,
    highlighted: false,

    content: {
      pt: {
        name: "Certificado avulso",
        description:
          "Um registro digital verificável com certificado, impressão digital SHA-256, Evidence Key™ e QR Code.",
        priceLabel: "US$ 8",
        creditsLabel: "1 registro",
      },

      en: {
        name: "Single certificate",
        description:
          "One verifiable digital record with certificate, SHA-256 fingerprint, Evidence Key™, and QR Code.",
        priceLabel: "US$ 8",
        creditsLabel: "1 record",
      },
    },
  },

  packages: {
    enabled: false,

    items: [
      {
        id: "package-5-records",
        type: "package",
        credits: 5,
        priceInCents: 3500,
        active: false,
        checkoutEnabled: false,
        highlighted: false,

        content: {
          pt: {
            name: "Pacote com 5 registros",
            description:
              "Créditos para criar cinco provas digitais verificáveis quando você precisar.",
            priceLabel: "US$ 35",
            creditsLabel: "5 registros",
          },

          en: {
            name: "5-record package",
            description:
              "Credits to create five verifiable digital proofs whenever you need them.",
            priceLabel: "US$ 35",
            creditsLabel: "5 records",
          },
        },
      },

      {
        id: "package-8-records",
        type: "package",
        credits: 8,
        priceInCents: 5200,
        active: false,
        checkoutEnabled: false,
        highlighted: true,

        content: {
          pt: {
            name: "Pacote com 8 registros",
            description:
              "Uma opção equilibrada para profissionais que registram arquivos com frequência.",
            priceLabel: "US$ 52",
            creditsLabel: "8 registros",
          },

          en: {
            name: "8-record package",
            description:
              "A balanced option for professionals who register files regularly.",
            priceLabel: "US$ 52",
            creditsLabel: "8 records",
          },
        },
      },

      {
        id: "package-12-records",
        type: "package",
        credits: 12,
        priceInCents: 7200,
        active: false,
        checkoutEnabled: false,
        highlighted: false,

        content: {
          pt: {
            name: "Pacote com 12 registros",
            description:
              "Mais registros e melhor valor por prova digital para uso recorrente.",
            priceLabel: "US$ 72",
            creditsLabel: "12 registros",
          },

          en: {
            name: "12-record package",
            description:
              "More records and better value per digital proof for recurring use.",
            priceLabel: "US$ 72",
            creditsLabel: "12 records",
          },
        },
      },
    ],
  },
}

function normalizeLanguage(lang) {
  return SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : DEFAULT_LANGUAGE
}

function localizeProduct(product, lang) {
  const normalizedLanguage = normalizeLanguage(lang)
  const localizedContent = product.content[normalizedLanguage]

  return {
    id: product.id,
    type: product.type,
    credits: product.credits,
    priceInCents: product.priceInCents,
    active: product.active,
    checkoutEnabled: product.checkoutEnabled,
    highlighted: product.highlighted,
    currency: PRODUCT_CURRENCY,
    ...localizedContent,
  }
}

export function getLandingProducts(lang = DEFAULT_LANGUAGE) {
  const products = []

  if (productCatalog.single.active) {
    products.push(
      localizeProduct(productCatalog.single, lang),
    )
  }

  if (productCatalog.packages.enabled) {
    const activePackages = productCatalog.packages.items
      .filter((product) => product.active)
      .map((product) => localizeProduct(product, lang))

    products.push(...activePackages)
  }

  return products
}

export function getProductById(
  productId,
  lang = DEFAULT_LANGUAGE,
) {
  if (
    productCatalog.single.id === productId &&
    productCatalog.single.active
  ) {
    return localizeProduct(productCatalog.single, lang)
  }

  if (!productCatalog.packages.enabled) {
    return null
  }

  const packageProduct = productCatalog.packages.items.find(
    (product) =>
      product.id === productId &&
      product.active,
  )

  if (!packageProduct) {
    return null
  }

  return localizeProduct(packageProduct, lang)
}