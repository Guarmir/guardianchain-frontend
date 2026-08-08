import {
  useCallback,
  useEffect,
  useState,
} from "react"

import {
  Link,
} from "react-router-dom"

import AdminDashboard from "../components/admin/AdminDashboard.jsx"

import {
  AdminApiError,
  getAdminOverview,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "../services/adminApi.js"

import "./AdminLoginPage.css"

const INITIAL_FORM = {
  email: "",
  password: "",
}

function getErrorMessage(error) {
  if (
    error instanceof AdminApiError
  ) {
    return error.message
  }

  return (
    "Ocorreu um erro inesperado. " +
    "Tente novamente."
  )
}

function AdminLoginPage() {
  const [
    form,
    setForm,
  ] = useState(INITIAL_FORM)

  const [
    admin,
    setAdmin,
  ] = useState(null)

  const [
    overview,
    setOverview,
  ] = useState(null)

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true)

  const [
    loadingOverview,
    setLoadingOverview,
  ] = useState(false)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("")

  const loadOverview = useCallback(
    async ({
      signal,
    } = {}) => {
      setLoadingOverview(true)

      try {
        const result =
          await getAdminOverview({
            signal,
          })

        setOverview(
          result?.overview || null,
        )
      } catch (error) {
        if (
          error?.name === "AbortError"
        ) {
          return
        }

        if (
          error instanceof
            AdminApiError &&
          error.status === 401
        ) {
          setAdmin(null)
          setOverview(null)
          return
        }

        setErrorMessage(
          getErrorMessage(error),
        )
      } finally {
        setLoadingOverview(false)
      }
    },
    [],
  )

  useEffect(() => {
    const controller =
      new AbortController()

    let active = true

    async function checkCurrentSession() {
      try {
        const result =
          await getAdminSession({
            signal:
              controller.signal,
          })

        if (!active) {
          return
        }

        const authenticatedAdmin =
          result?.admin || null

        setAdmin(
          authenticatedAdmin,
        )

        if (authenticatedAdmin) {
          await loadOverview({
            signal:
              controller.signal,
          })
        }
      } catch (error) {
        if (
          !active ||
          error?.name ===
            "AbortError"
        ) {
          return
        }

        if (
          error instanceof
            AdminApiError &&
          error.status === 401
        ) {
          setAdmin(null)
          setOverview(null)
          return
        }

        setErrorMessage(
          getErrorMessage(error),
        )
      } finally {
        if (active) {
          setCheckingSession(false)
        }
      }
    }

    checkCurrentSession()

    return () => {
      active = false
      controller.abort()
    }
  }, [loadOverview])

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))

    if (errorMessage) {
      setErrorMessage("")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (submitting) {
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const result =
        await loginAdmin({
          email:
            form.email.trim(),

          password:
            form.password,
        })

      const authenticatedAdmin =
        result?.admin || null

      setAdmin(
        authenticatedAdmin,
      )

      setForm((currentForm) => ({
        ...currentForm,
        password: "",
      }))

      if (authenticatedAdmin) {
        await loadOverview()
      }
    } catch (error) {
      setAdmin(null)
      setOverview(null)

      setErrorMessage(
        getErrorMessage(error),
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    if (loggingOut) {
      return
    }

    setLoggingOut(true)
    setErrorMessage("")

    try {
      await logoutAdmin()

      setAdmin(null)
      setOverview(null)
      setForm(INITIAL_FORM)
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error),
      )
    } finally {
      setLoggingOut(false)
    }
  }

  if (checkingSession) {
    return (
      <main className="admin-login-page">
        <section
          className={
            "admin-login-card " +
            "admin-login-card--status"
          }
          aria-live="polite"
        >
          <div
            className="admin-login-spinner"
            aria-hidden="true"
          />

          <p>
            Verificando sessão
            administrativa...
          </p>
        </section>
      </main>
    )
  }

  if (admin) {
    return (
      <AdminDashboard
        admin={admin}
        overview={overview}
        loadingOverview={
          loadingOverview
        }
        loggingOut={loggingOut}
        errorMessage={errorMessage}
        onRefresh={() =>
          loadOverview()
        }
        onLogout={handleLogout}
      />
    )
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-brand__mark">
            G
          </span>

          <div>
            <strong>
              GuardianChain
            </strong>

            <span>
              Área administrativa
            </span>
          </div>
        </div>

        <header className="admin-login-header">
          <p className="admin-login-eyebrow">
            Acesso restrito
          </p>

          <h1>
            Entrar no painel
          </h1>

          <p>
            Use as credenciais
            administrativas do
            proprietário do GuardianChain.
          </p>
        </header>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="admin-email">
            E-mail administrativo
          </label>

          <input
            id="admin-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            inputMode="email"
            placeholder="seu-email@exemplo.com"
            maxLength={254}
            required
            disabled={submitting}
          />

          <label htmlFor="admin-password">
            Senha administrativa
          </label>

          <input
            id="admin-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            minLength={1}
            maxLength={128}
            required
            disabled={submitting}
          />

          {errorMessage ? (
            <div
              className="admin-login-error"
              role="alert"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            className="admin-login-button"
            type="submit"
            disabled={
              submitting ||
              !form.email.trim() ||
              !form.password
            }
          >
            {submitting
              ? "Verificando acesso..."
              : "Entrar com segurança"}
          </button>
        </form>

        <div className="admin-login-security">
          <span aria-hidden="true">
            🔒
          </span>

          <p>
            A senha não é armazenada no
            navegador. A sessão usa um
            cookie protegido e pode ser
            encerrada a qualquer momento.
          </p>
        </div>

        <Link
          className="admin-login-home-link"
          to="/"
        >
          Voltar para o GuardianChain
        </Link>
      </section>
    </main>
  )
}

export default AdminLoginPage