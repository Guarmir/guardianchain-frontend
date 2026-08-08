import {
  useEffect,
  useState,
} from "react"

import {
  AdminApiError,
  getAdminCustomersPage,
} from "../../services/adminApi.js"

const PAGE_SIZE = 10

const STATUS_LABELS = {
  active: "Ativo",
  blocked: "Bloqueado",
  disabled: "Desativado",
  not_created: "Não criada",
}

const OWNER_TYPE_LABELS = {
  individual: "Pessoa física",
  company: "Empresa",
}

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function formatDate(value) {
  if (!value) {
    return "Sem atividade"
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Data indisponível"
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(date)
}

function getStatusLabel(status) {
  return (
    STATUS_LABELS[status] ||
    status ||
    "Indisponível"
  )
}

function getOwnerTypeLabel(ownerType) {
  return (
    OWNER_TYPE_LABELS[ownerType] ||
    ownerType ||
    "Não informado"
  )
}

function getStatusClass(status) {
  return status === "active"
    ? "admin-status admin-status--active"
    : "admin-status admin-status--inactive"
}

function getErrorMessage(error) {
  if (
    error instanceof AdminApiError
  ) {
    return error.message
  }

  return "Não foi possível carregar os clientes."
}

function CustomerMetricCard({
  label,
  value,
  description,
}) {
  return (
    <article className="admin-metric-card">
      <span className="admin-metric-card__label">
        {label}
      </span>

      <strong className="admin-metric-card__value">
        {value}
      </strong>

      <p>{description}</p>
    </article>
  )
}

function AdminCustomersSection({
  overview,
}) {
  const [
    page,
    setPage,
  ] = useState(1)

  const [
    refreshVersion,
    setRefreshVersion,
  ] = useState(0)

  const [
    customerData,
    setCustomerData,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("")

  useEffect(() => {
    const controller =
      new AbortController()

    let active = true

    async function loadCustomers() {
      setLoading(true)
      setErrorMessage("")

      try {
        const result =
          await getAdminCustomersPage({
            page,
            pageSize: PAGE_SIZE,
            signal:
              controller.signal,
          })

        if (!active) {
          return
        }

        setCustomerData(
          result?.customers || null,
        )
      } catch (error) {
        if (
          !active ||
          error?.name ===
            "AbortError"
        ) {
          return
        }

        setErrorMessage(
          getErrorMessage(error),
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadCustomers()

    return () => {
      active = false
      controller.abort()
    }
  }, [
    page,
    refreshVersion,
  ])

  const customers =
    customerData?.customers || []

  const pagination =
    customerData?.pagination || {
      page,
      pageSize: PAGE_SIZE,
      totalItems: 0,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    }

  const totalCustomers =
    toNumber(
      pagination.totalItems,
    ) ||
    toNumber(
      overview?.totals?.customers,
    )

  const displayedCredits =
    customers.reduce(
      (total, customer) =>
        total +
        toNumber(
          customer
            ?.creditAccount
            ?.balance,
        ),
      0,
    )

  const displayedCertificates =
    customers.reduce(
      (total, customer) =>
        total +
        toNumber(
          customer
            ?.activity
            ?.totalCertificates,
        ),
      0,
    )

  function goToPreviousPage() {
    if (
      loading ||
      !pagination.hasPreviousPage
    ) {
      return
    }

    setPage((currentPage) =>
      Math.max(
        1,
        currentPage - 1,
      ),
    )
  }

  function goToNextPage() {
    if (
      loading ||
      !pagination.hasNextPage
    ) {
      return
    }

    setPage((currentPage) =>
      currentPage + 1,
    )
  }

  function refreshCustomers() {
    if (loading) {
      return
    }

    setRefreshVersion(
      (currentVersion) =>
        currentVersion + 1,
    )
  }

  return (
    <>
      <section className="admin-dashboard-metrics admin-dashboard-metrics--compact">
        <CustomerMetricCard
          label="Clientes cadastrados"
          value={totalCustomers}
          description="Total de contas encontradas."
        />

        <CustomerMetricCard
          label="Clientes exibidos"
          value={customers.length}
          description="Quantidade mostrada nesta página."
        />

        <CustomerMetricCard
          label="Créditos exibidos"
          value={displayedCredits}
          description="Saldo das contas desta página."
        />

        <CustomerMetricCard
          label="Certificados exibidos"
          value={displayedCertificates}
          description="Certificados dos clientes desta página."
        />
      </section>

      <section className="admin-dashboard-section">
        <div className="admin-dashboard-section__header">
          <div>
            <h2>
              Lista de clientes
            </h2>

            <p>
              Dados pessoais protegidos por
              mascaramento antes de serem
              enviados ao painel.
            </p>
          </div>

          <button
            type="button"
            className="admin-dashboard-refresh"
            onClick={refreshCustomers}
            disabled={loading}
          >
            {loading
              ? "Atualizando..."
              : "Atualizar clientes"}
          </button>
        </div>

        <div className="admin-dashboard-information">
          <strong>
            Proteção de dados ativa
          </strong>

          <p>
            O endpoint administrativo não
            envia nome completo, e-mail
            completo, motivo de bloqueio,
            dados de pagamento, hashes ou
            informações privadas dos
            certificados.
          </p>
        </div>

        {errorMessage ? (
          <div
            className="admin-login-error"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {loading &&
        !customerData ? (
          <div className="admin-dashboard-loading">
            <div
              className="admin-login-spinner"
              aria-hidden="true"
            />

            <p>
              Carregando clientes...
            </p>
          </div>
        ) : null}

        {!loading &&
        customers.length === 0 ? (
          <div className="admin-dashboard-empty">
            <div
              className="admin-dashboard-empty__icon"
              aria-hidden="true"
            >
              —
            </div>

            <div>
              <strong>
                Nenhum cliente cadastrado
              </strong>

              <p>
                Os clientes aparecerão
                automaticamente quando forem
                registrados no novo banco
                administrativo.
              </p>
            </div>
          </div>
        ) : null}

        {customers.length > 0 ? (
          <div className="admin-data-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Cliente protegido</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Créditos</th>
                  <th>Pedidos</th>
                  <th>Certificados</th>
                  <th>Última atividade</th>
                </tr>
              </thead>

              <tbody>
                {customers.map(
                  (customer) => {
                    const lastActivity =
                      customer
                        ?.activity
                        ?.lastCertificateAt ||
                      customer
                        ?.activity
                        ?.lastOrderAt ||
                      customer.createdAt

                    return (
                      <tr
                        key={customer.id}
                      >
                        <td>
                          <strong>
                            {customer.maskedName ||
                              "Nome não informado"}
                          </strong>

                          <span>
                            {customer.maskedEmail ||
                              "E-mail protegido"}
                          </span>
                        </td>

                        <td>
                          {getOwnerTypeLabel(
                            customer.ownerType,
                          )}
                        </td>

                        <td>
                          <span
                            className={
                              getStatusClass(
                                customer.status,
                              )
                            }
                          >
                            {getStatusLabel(
                              customer.status,
                            )}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {toNumber(
                              customer
                                ?.creditAccount
                                ?.balance,
                            )}
                          </strong>

                          <span>
                            Conta:{" "}
                            {getStatusLabel(
                              customer
                                ?.creditAccount
                                ?.status,
                            )}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {toNumber(
                              customer
                                ?.activity
                                ?.totalOrders,
                            )}
                          </strong>

                          <span>
                            Pagos:{" "}
                            {toNumber(
                              customer
                                ?.activity
                                ?.paidOrders,
                            )}
                          </span>
                        </td>

                        <td>
                          {toNumber(
                            customer
                              ?.activity
                              ?.totalCertificates,
                          )}
                        </td>

                        <td>
                          {formatDate(
                            lastActivity,
                          )}
                        </td>
                      </tr>
                    )
                  },
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="admin-dashboard-section__header">
          <p>
            Exibindo{" "}
            <strong>
              {customers.length}
            </strong>{" "}
            de{" "}
            <strong>
              {totalCustomers}
            </strong>{" "}
            cliente(s)
          </p>

          <div>
            <button
              type="button"
              className="admin-dashboard-refresh"
              onClick={
                goToPreviousPage
              }
              disabled={
                loading ||
                !pagination
                  .hasPreviousPage
              }
            >
              Anterior
            </button>

            <span>
              Página{" "}
              <strong>
                {pagination.page || 1}
              </strong>{" "}
              de{" "}
              <strong>
                {pagination.totalPages || 1}
              </strong>
            </span>

            <button
              type="button"
              className="admin-dashboard-refresh"
              onClick={goToNextPage}
              disabled={
                loading ||
                !pagination
                  .hasNextPage
              }
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminCustomersSection