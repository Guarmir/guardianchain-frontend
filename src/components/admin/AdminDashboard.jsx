import {
  useMemo,
  useState,
} from "react"

import {
  Link,
} from "react-router-dom"

import AdminAuditSection from "./AdminAuditSection.jsx"
import AdminCustomersSection from "./AdminCustomersSection.jsx"
import AdminDashboardNavigation from "./AdminDashboardNavigation.jsx"

import "./AdminDashboard.css"

const PRODUCT_LABELS = {
  "single-certificate":
    "Certificado avulso",

  "package-5-records":
    "Pacote com 5 registros",

  "package-8-records":
    "Pacote com 8 registros",

  "package-12-records":
    "Pacote com 12 registros",
}

const SECTION_INFORMATION = {
  overview: {
    eyebrow: "VISÃO GERAL",
    title: "Controle do GuardianChain",
    description:
      "Acompanhamento inicial de produtos, vendas, créditos e certificados.",
  },

  products: {
    eyebrow: "CATÁLOGO",
    title: "Produtos",
    description:
      "Preços, créditos e disponibilidade dos produtos cadastrados.",
  },

  sales: {
    eyebrow: "COMERCIAL",
    title: "Vendas",
    description:
      "Pedidos, pagamentos e resultados separados por produto.",
  },

  customers: {
    eyebrow: "USUÁRIOS",
    title: "Clientes",
    description:
      "Contas, créditos, compras e certificados com dados pessoais protegidos.",
  },

  audit: {
    eyebrow: "SEGURANÇA",
    title: "Auditoria",
    description:
      "Histórico protegido dos eventos administrativos do sistema.",
  },
}

function toNumber(value) {
  const number = Number(value)

  return Number.isFinite(number)
    ? number
    : 0
}

function formatMoney(
  unitAmount,
  currency = "USD",
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
    },
  ).format(
    toNumber(unitAmount) / 100,
  )
}

function getProductLabel(productId) {
  return (
    PRODUCT_LABELS[productId] ||
    productId
  )
}

function getDatabaseLabel(overview) {
  return (
    overview?.system?.databaseLabel ||
    "não informado"
  )
}

function MetricCard({
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

function SectionHeader({
  title,
  description,
}) {
  return (
    <div className="admin-dashboard-section__header">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="admin-dashboard-empty">
      <div
        className="admin-dashboard-empty__icon"
        aria-hidden="true"
      >
        —
      </div>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  )
}

function ProductsTable({
  products,
}) {
  return (
    <div className="admin-products-table-wrapper">
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Créditos</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Checkout</th>
          </tr>
        </thead>

        <tbody>
          {products.map(
            (product) => (
              <tr key={product.id}>
                <td>
                  <strong>
                    {getProductLabel(
                      product.id,
                    )}
                  </strong>

                  <span>
                    {product.id}
                  </span>
                </td>

                <td>
                  {product.credits}
                </td>

                <td>
                  {formatMoney(
                    product.unitAmount,
                    product.currency,
                  )}
                </td>

                <td>
                  <span
                    className={
                      product.active
                        ? "admin-status admin-status--active"
                        : "admin-status admin-status--inactive"
                    }
                  >
                    {product.active
                      ? "Ativo"
                      : "Bloqueado"}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      product.checkoutEnabled
                        ? "admin-status admin-status--active"
                        : "admin-status admin-status--inactive"
                    }
                  >
                    {product.checkoutEnabled
                      ? "Liberado"
                      : "Desativado"}
                  </span>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

function OverviewSection({
  overview,
}) {
  const totals =
    overview?.totals || {}

  const databaseLabel =
    getDatabaseLabel(overview)

  return (
    <>
      <section className="admin-dashboard-metrics">
        <MetricCard
          label="Clientes"
          value={totals.customers || 0}
          description="Contas registradas no produto."
        />

        <MetricCard
          label="Pedidos"
          value={totals.orders || 0}
          description="Todos os pedidos recebidos."
        />

        <MetricCard
          label="Pagamentos"
          value={totals.paidOrders || 0}
          description="Pedidos com pagamento confirmado."
        />

        <MetricCard
          label="Certificados"
          value={totals.certificates || 0}
          description="Provas digitais registradas."
        />

        <MetricCard
          label="Créditos disponíveis"
          value={
            totals.availableCredits || 0
          }
          description="Créditos existentes nas contas."
        />

        <MetricCard
          label="Sessões ativas"
          value={
            totals.activeAdminSessions ||
            0
          }
          description="Acessos administrativos válidos."
        />

        <MetricCard
          label="Eventos de auditoria"
          value={totals.auditLogs || 0}
          description="Ações administrativas registradas."
        />
      </section>

      <section className="admin-dashboard-section">
        <SectionHeader
          title="Produtos cadastrados"
          description="Resumo dos preços e da disponibilidade atual."
        />

        <ProductsTable
          products={
            overview?.products || []
          }
        />
      </section>

      <section className="admin-dashboard-section">
        <SectionHeader
          title="Estrutura administrativa"
          description="Situação da base de dados utilizada neste ambiente."
        />

        <dl className="admin-system-details">
          <div>
            <dt>
              Tabelas administrativas
            </dt>

            <dd>
              {
                overview?.system
                  ?.administrativeTables || 0
              }
            </dd>
          </div>

          <div>
            <dt>
              Migrações aplicadas
            </dt>

            <dd>
              {
                overview?.system
                  ?.appliedMigrations || 0
              }
            </dd>
          </div>

          <div>
            <dt>Ambiente</dt>

            <dd>
              {databaseLabel}
            </dd>
          </div>

          <div>
            <dt>Permissão atual</dt>
            <dd>Somente consulta</dd>
          </div>
        </dl>
      </section>
    </>
  )
}

function ProductsSection({
  overview,
}) {
  const products =
    overview?.products || []

  const databaseLabel =
    getDatabaseLabel(overview)

  return (
    <section className="admin-dashboard-section admin-dashboard-section--first">
      <SectionHeader
        title="Catálogo de produtos"
        description={`Configuração comercial registrada no ambiente ${databaseLabel}.`}
      />

      <ProductsTable
        products={products}
      />

      <div className="admin-dashboard-information">
        <strong>
          Alterações bloqueadas
        </strong>

        <p>
          Os controles para editar preços,
          ativar pacotes ou liberar checkout
          serão implementados posteriormente
          com confirmação e auditoria.
        </p>
      </div>
    </section>
  )
}

function SalesSection({
  overview,
}) {
  const totals =
    overview?.totals || {}

  const salesByProduct =
    overview?.salesByProduct || []

  const totalRecordedAmount =
    useMemo(
      () =>
        salesByProduct.reduce(
          (sum, sale) =>
            sum +
            toNumber(
              sale.amountTotal,
            ),
          0,
        ),
      [salesByProduct],
    )

  return (
    <>
      <section className="admin-dashboard-metrics admin-dashboard-metrics--compact">
        <MetricCard
          label="Pedidos recebidos"
          value={totals.orders || 0}
          description="Todos os pedidos registrados."
        />

        <MetricCard
          label="Pagamentos confirmados"
          value={totals.paidOrders || 0}
          description="Pedidos com pagamento concluído."
        />

        <MetricCard
          label="Valor registrado"
          value={formatMoney(
            totalRecordedAmount,
            "USD",
          )}
          description="Soma dos pedidos agrupados por produto."
        />
      </section>

      <section className="admin-dashboard-section">
        <SectionHeader
          title="Vendas por produto"
          description="Quantidade de pedidos, valor total e créditos adquiridos."
        />

        {salesByProduct.length === 0 ? (
          <EmptyState
            title="Nenhuma venda registrada"
            description="Os resultados aparecerão aqui após o primeiro pagamento registrado no novo banco administrativo."
          />
        ) : (
          <div className="admin-data-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Pedidos</th>
                  <th>Valor</th>
                  <th>Créditos vendidos</th>
                </tr>
              </thead>

              <tbody>
                {salesByProduct.map(
                  (sale) => (
                    <tr
                      key={
                        sale.productId
                      }
                    >
                      <td>
                        <strong>
                          {getProductLabel(
                            sale.productId,
                          )}
                        </strong>

                        <span>
                          {
                            sale.productId
                          }
                        </span>
                      </td>

                      <td>
                        {
                          sale.orderCount
                        }
                      </td>

                      <td>
                        {formatMoney(
                          sale.amountTotal,
                          "USD",
                        )}
                      </td>

                      <td>
                        {
                          sale.creditsPurchased
                        }
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

function AdminDashboard({
  admin,
  overview,
  loadingOverview,
  loggingOut,
  errorMessage,
  onRefresh,
  onLogout,
}) {
  const [
    activeSection,
    setActiveSection,
  ] = useState("overview")

  const sectionInformation =
    SECTION_INFORMATION[
      activeSection
    ] ||
    SECTION_INFORMATION.overview

  function renderActiveSection() {
    switch (activeSection) {
      case "products":
        return (
          <ProductsSection
            overview={overview}
          />
        )

      case "sales":
        return (
          <SalesSection
            overview={overview}
          />
        )

      case "customers":
        return (
          <AdminCustomersSection
            overview={overview}
          />
        )

      case "audit":
        return (
          <AdminAuditSection
            overview={overview}
          />
        )

      default:
        return (
          <OverviewSection
            overview={overview}
          />
        )
    }
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div className="admin-login-brand">
            <span className="admin-login-brand__mark">
              G
            </span>

            <div>
              <strong>
                GuardianChain
              </strong>

              <span>
                Painel administrativo
              </span>
            </div>
          </div>

          <div className="admin-dashboard-account">
            <div>
              <span>
                Conta autenticada
              </span>

              <strong>
                {admin.email}
              </strong>
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
            >
              {loggingOut
                ? "Saindo..."
                : "Sair"}
            </button>
          </div>
        </header>

        <AdminDashboardNavigation
          activeSection={activeSection}
          onSectionChange={
            setActiveSection
          }
        />

        <div className="admin-dashboard-title">
          <div>
            <p>
              {
                sectionInformation.eyebrow
              }
            </p>

            <h1>
              {
                sectionInformation.title
              }
            </h1>

            <span>
              {
                sectionInformation.description
              }
            </span>
          </div>

          <button
            type="button"
            className="admin-dashboard-refresh"
            onClick={onRefresh}
            disabled={loadingOverview}
          >
            {loadingOverview
              ? "Atualizando..."
              : "Atualizar dados"}
          </button>
        </div>

        {errorMessage ? (
          <div
            className="admin-login-error"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {loadingOverview &&
        !overview ? (
          <section className="admin-dashboard-loading">
            <div
              className="admin-login-spinner"
              aria-hidden="true"
            />

            <p>
              Carregando informações
              administrativas...
            </p>
          </section>
        ) : null}

        {overview ? (
          <div className="admin-dashboard-content">
            {renderActiveSection()}
          </div>
        ) : null}

        <footer className="admin-dashboard-footer">
          <p>
            Ambiente protegido e atualmente
            configurado somente para
            consulta.
          </p>

          <Link to="/">
            Voltar para o GuardianChain
          </Link>
        </footer>
      </section>
    </main>
  )
}

export default AdminDashboard