const NAVIGATION_ITEMS = [
  {
    id: "overview",
    label: "Visão geral",
  },
  {
    id: "products",
    label: "Produtos",
  },
  {
    id: "sales",
    label: "Vendas",
  },
  {
    id: "customers",
    label: "Clientes",
  },
  {
    id: "audit",
    label: "Auditoria",
  },
]

function AdminDashboardNavigation({
  activeSection,
  onSectionChange,
}) {
  return (
    <nav
      className="admin-dashboard-navigation"
      aria-label="Navegação administrativa"
    >
      {NAVIGATION_ITEMS.map((item) => {
        const active =
          activeSection === item.id

        return (
          <button
            key={item.id}
            type="button"
            className={
              active
                ? "admin-dashboard-navigation__button admin-dashboard-navigation__button--active"
                : "admin-dashboard-navigation__button"
            }
            aria-current={
              active
                ? "page"
                : undefined
            }
            onClick={() =>
              onSectionChange(
                item.id,
              )
            }
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export default AdminDashboardNavigation