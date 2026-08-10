const SAMPLE_HASH =
  "0x9f3c2d7e8a4b6c1f0d5e7a9b3c8d2f4a6e1b5c7d9f2a4e6b8c1d3f5a7b9e2c4d"

const CONTENT = {
  pt: {
    title:
      "Certificado de Evidência GuardianChain",

    subtitle:
      "Registro de Evidência Digital Verificável",

    description:
      "Este certificado cria uma camada adicional de evidência verificável por meio de hash criptográfico, timestamp, titularidade declarada, Evidence Key™ e verificação pública.",

    evidenceKey:
      "GC-2026-BR-DEMO01-9F3C2D-1A2B3C4D",

    evidenceDescription:
      "Chave exclusiva do certificado GuardianChain para facilitar identificação, conferência e compartilhamento da prova digital.",

    holder:
      "Titular declarado",

    nameLabel:
      "Nome",

    name:
      "Cliente Exemplo",

    emailLabel:
      "E-mail",

    typeLabel:
      "Tipo",

    type:
      "Pessoa física",

    declarationTitle:
      "Declaração do titular",

    declaration:
      "O registrante declarou, sob sua responsabilidade, ser autor, titular, possuir direito legítimo, posse ou custódia autorizada sobre o conteúdo digital representado por este hash criptográfico.",

    technicalTitle:
      "Dados técnicos da evidência",

    fileName:
      "Nome do arquivo",

    utc:
      "Timestamp UTC",

    brazil:
      "Horário do Brasil",

    network:
      "Rede blockchain",

    payment:
      "Referência de pagamento",

    hash:
      "Hash SHA-256",

    verification:
      "URL de verificação pública",

    independentTitle:
      "Verificação independente",

    independent:
      "Este registro pode ser verificado utilizando a Evidence Key™, o hash criptográfico, a URL pública de verificação e os dados do certificado. O arquivo original não é enviado nem armazenado pela GuardianChain.",

    limitationTitle:
      "Limitação importante",

    limitation:
      "Este certificado comprova a existência deste hash, o timestamp do registro e a declaração do titular. A GuardianChain não valida o conteúdo interno do arquivo, não certifica como ele foi criado ou obtido e não substitui cartório, perícia técnica ou validação judicial formal.",

    footer:
      "GuardianChain — Camada independente de evidência digital verificável.",

    verificationUrl:
      "guardianchain.online/verify?...&lang=pt",
  },

  en: {
    title:
      "GuardianChain Evidence Certificate",

    subtitle:
      "Verifiable Digital Evidence Record",

    description:
      "This certificate creates an additional verifiable evidence layer using cryptographic hashing, timestamping, declared ownership, Evidence Key™ and public verification.",

    evidenceKey:
      "GC-2026-EN-DEMO01-9F3C2D-1A2B3C4D",

    evidenceDescription:
      "Exclusive GuardianChain certificate key designed to make digital proof easier to identify, review and share.",

    holder:
      "Declared holder",

    nameLabel:
      "Name",

    name:
      "Sample Client",

    emailLabel:
      "Email",

    typeLabel:
      "Type",

    type:
      "Individual",

    declarationTitle:
      "Owner declaration",

    declaration:
      "The registrant declared, under their own responsibility, that they are the author, owner, or have legitimate rights, possession or authorized custody over the digital content represented by this cryptographic hash.",

    technicalTitle:
      "Technical evidence data",

    fileName:
      "File name",

    utc:
      "UTC timestamp",

    brazil:
      "Brazil time",

    network:
      "Blockchain network",

    payment:
      "Payment reference",

    hash:
      "SHA-256 hash",

    verification:
      "Public verification URL",

    independentTitle:
      "Independent verification",

    independent:
      "This record can be verified using the Evidence Key™, the cryptographic hash, the public verification URL and the certificate data. The original file is never uploaded or stored by GuardianChain.",

    limitationTitle:
      "Important limitation",

    limitation:
      "This certificate proves the existence of this hash, the registration timestamp and the holder declaration. GuardianChain does not validate the internal file content, does not certify how it was created or obtained, and does not replace notarization, forensic analysis or formal judicial validation.",

    footer:
      "GuardianChain — Independent verifiable digital evidence layer.",

    verificationUrl:
      "guardianchain.online/verify?...&lang=en",
  },
}

function SectionTitle({
  children,
}) {
  return (
    <h3 style={styles.sectionTitle}>
      {children}
    </h3>
  )
}

export default function CertificateSamplePreview({
  lang = "en",
  compact = false,
}) {
  const normalizedLanguage =
    lang === "pt" ? "pt" : "en"

  const t =
    CONTENT[normalizedLanguage]

  return (
    <div
      style={{
        ...styles.frame,
        ...(compact
          ? styles.frameCompact
          : {}),
      }}
      aria-label={
        normalizedLanguage === "pt"
          ? "Exemplo do certificado GuardianChain"
          : "GuardianChain sample certificate"
      }
    >
      <article style={styles.certificate}>
        <header style={styles.header}>
          <h2 style={styles.title}>
            {t.title}
          </h2>

          <p style={styles.subtitle}>
            {t.subtitle}
          </p>
        </header>

        <div style={styles.body}>
          <p style={styles.description}>
            {t.description}
          </p>

          <div style={styles.evidenceBox}>
            <strong style={styles.evidenceLabel}>
              Evidence Key™
            </strong>

            <div style={styles.evidenceKey}>
              {t.evidenceKey}
            </div>

            <p style={styles.evidenceDescription}>
              {t.evidenceDescription}
            </p>
          </div>

          <SectionTitle>
            {t.holder}
          </SectionTitle>

          <div style={styles.lines}>
            <p>
              <strong>
                {t.nameLabel}:
              </strong>{" "}
              {t.name}
            </p>

            <p>
              <strong>
                {t.emailLabel}:
              </strong>{" "}
              sample@guardianchain.example
            </p>

            <p>
              <strong>
                {t.typeLabel}:
              </strong>{" "}
              {t.type}
            </p>
          </div>

          <SectionTitle>
            {t.declarationTitle}
          </SectionTitle>

          <p style={styles.text}>
            {t.declaration}
          </p>

          <SectionTitle>
            {t.technicalTitle}
          </SectionTitle>

          <div style={styles.lines}>
            <p>
              <strong>
                {t.fileName}:
              </strong>{" "}
              guardianchain-demo.pdf
            </p>

            <p>
              <strong>
                {t.utc}:
              </strong>{" "}
              2026-08-09 15:00:00 UTC
            </p>

            <p>
              <strong>
                {t.brazil}:
              </strong>{" "}
              09/08/2026, 12:00:00
            </p>

            <p>
              <strong>
                {t.network}:
              </strong>{" "}
              Polygon
            </p>

            <p>
              <strong>
                {t.payment}:
              </strong>{" "}
              pi_demo_guardianchain
            </p>
          </div>

          <SectionTitle>
            {t.hash}
          </SectionTitle>

          <p style={styles.hash}>
            {SAMPLE_HASH}
          </p>

          <SectionTitle>
            {t.verification}
          </SectionTitle>

          <div style={styles.verificationRow}>
            <p style={styles.url}>
              {t.verificationUrl}
            </p>

            <div
              style={styles.qr}
              aria-label="QR Code demo"
            >
              <strong>QR</strong>
              <span>DEMO</span>
            </div>
          </div>

          <SectionTitle>
            {t.independentTitle}
          </SectionTitle>

          <p style={styles.text}>
            {t.independent}
          </p>

          <SectionTitle>
            {t.limitationTitle}
          </SectionTitle>

          <p style={styles.text}>
            {t.limitation}
          </p>

          <div style={styles.footerLine} />

          <p style={styles.footer}>
            {t.footer}
          </p>
        </div>
      </article>
    </div>
  )
}

const styles = {
  frame: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.34)",
  },

  frameCompact: {
    maxHeight: "560px",
  },

  certificate: {
    background: "#ffffff",
    color: "#111827",
    textAlign: "left",
  },

  header: {
    background: "#1f2a6d",
    color: "#ffffff",
    padding: "28px 34px 24px",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.2,
  },

  subtitle: {
    margin: "8px 0 0",
    fontSize: "12px",
    opacity: 0.96,
  },

  body: {
    padding: "28px 34px 32px",
  },

  description: {
    margin: "0 0 22px",
    fontSize: "11px",
    lineHeight: 1.55,
  },

  evidenceBox: {
    padding: "14px 16px",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "10px",
    marginBottom: "22px",
  },

  evidenceLabel: {
    display: "block",
    color: "#1f2a6d",
    fontSize: "12px",
  },

  evidenceKey: {
    marginTop: "6px",
    fontFamily: "monospace",
    color: "#111827",
    fontWeight: "800",
    fontSize: "13px",
    overflowWrap: "anywhere",
  },

  evidenceDescription: {
    margin: "6px 0 0",
    color: "#4b5563",
    fontSize: "9px",
    lineHeight: 1.4,
  },

  sectionTitle: {
    color: "#1f2a6d",
    margin: "18px 0 8px",
    fontSize: "13px",
  },

  lines: {
    fontSize: "10px",
    lineHeight: 1.45,
  },

  text: {
    margin: 0,
    color: "#374151",
    fontSize: "9.5px",
    lineHeight: 1.5,
  },

  hash: {
    margin: 0,
    fontFamily: "monospace",
    color: "#374151",
    fontSize: "9px",
    overflowWrap: "anywhere",
  },

  verificationRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "22px",
  },

  url: {
    margin: 0,
    color: "#1d4ed8",
    fontSize: "9px",
    lineHeight: 1.4,
    overflowWrap: "anywhere",
    flex: 1,
  },

  qr: {
    width: "76px",
    height: "76px",
    flexShrink: 0,
    border: "6px solid #111827",
    background:
      "repeating-linear-gradient(45deg,#111827 0 5px,#ffffff 5px 10px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#111827",
    fontSize: "11px",
  },

  footerLine: {
    marginTop: "20px",
    borderTop: "1px solid #d1d5db",
  },

  footer: {
    margin: "12px 0 0",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "9px",
  },
}