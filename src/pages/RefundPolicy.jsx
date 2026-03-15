import { useSearchParams } from "react-router-dom"

export default function RefundPolicy() {
  const [params] = useSearchParams()

  const langParam = params.get("lang")
  const lang = langParam === "pt" ? "pt" : "en"

  const content = {
    en: {
      title: "Refund Policy",
      updated: "Last updated:",
      p1: "GuardianChain provides a digital proof of existence service by generating a cryptographic hash and issuing a verifiable certificate.",
      p2: "The service creates a timestamped record proving that a digital file existed at a specific moment in time. For privacy and security reasons, the original file is never uploaded or stored on our servers. Only the cryptographic hash of the file is processed.",
      p3: "Due to the nature of this service, which generates an irreversible digital record, refunds are generally not available once the certificate has been successfully generated.",
      p4: "Refunds may only be considered in the following situations:",
      item1: "Duplicate payment",
      item2: "Technical error preventing certificate generation",
      item3: "Failure in delivering the certificate by email",
      p5: "Refund requests must be submitted within 7 days of the transaction date.",
      p6: "GuardianChain reserves the right to evaluate refund requests on a case-by-case basis and may request additional information when necessary.",
      p7: "If you believe you qualify for a refund, please contact our support team:",
    },
    pt: {
      title: "Política de Reembolso",
      updated: "Última atualização:",
      p1: "A GuardianChain fornece um serviço de prova digital de existência por meio da geração de um hash criptográfico e da emissão de um certificado verificável.",
      p2: "O serviço cria um registro com data e hora que comprova que um arquivo digital existia em um momento específico no tempo. Por razões de privacidade e segurança, o arquivo original nunca é enviado ou armazenado em nossos servidores. Apenas o hash criptográfico do arquivo é processado.",
      p3: "Devido à natureza deste serviço, que gera um registro digital irreversível, reembolsos geralmente não estão disponíveis após a geração bem-sucedida do certificado.",
      p4: "Reembolsos poderão ser considerados apenas nas seguintes situações:",
      item1: "Pagamento duplicado",
      item2: "Erro técnico que impeça a geração do certificado",
      item3: "Falha na entrega do certificado por email",
      p5: "Solicitações de reembolso devem ser enviadas em até 7 dias após a data da transação.",
      p6: "A GuardianChain se reserva o direito de avaliar solicitações de reembolso caso a caso e poderá solicitar informações adicionais quando necessário.",
      p7: "Se você acredita que tem direito a um reembolso, entre em contato com nossa equipe de suporte:",
    },
  }

  const t = content[lang]

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>{t.title}</h1>

        <p>
          <strong>{t.updated}</strong> 2026
        </p>

        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>
        <p>{t.p4}</p>

        <ul>
          <li>{t.item1}</li>
          <li>{t.item2}</li>
          <li>{t.item3}</li>
        </ul>

        <p>{t.p5}</p>
        <p>{t.p6}</p>
        <p>{t.p7}</p>

        <p>
          <a href="mailto:support@guardianchain.online">
            support@guardianchain.online
          </a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 20px",
    background: "linear-gradient(180deg,#0b1220,#1e3a8a)",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    maxWidth: "900px",
    background: "white",
    padding: "40px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    lineHeight: "1.7",
    color: "#111",
  },
}