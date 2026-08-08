import {
  useEffect,
  useState,
} from "react"

import {
  useLocation,
} from "react-router-dom"

import "./AdminThemeToggle.css"

const STORAGE_KEY =
  "guardianchain-admin-theme"

const DARK_THEME = "dark"
const LIGHT_THEME = "light"

function readInitialTheme() {
  if (typeof window === "undefined") {
    return DARK_THEME
  }

  const savedTheme =
    window.localStorage.getItem(
      STORAGE_KEY,
    )

  if (
    savedTheme === DARK_THEME ||
    savedTheme === LIGHT_THEME
  ) {
    return savedTheme
  }

  const prefersLight =
    window.matchMedia?.(
      "(prefers-color-scheme: light)",
    ).matches

  return prefersLight
    ? LIGHT_THEME
    : DARK_THEME
}

function AdminThemeToggle() {
  const {
    pathname,
  } = useLocation()

  const isAdminRoute =
    pathname.startsWith("/admin")

  const [
    theme,
    setTheme,
  ] = useState(readInitialTheme)

  useEffect(() => {
    if (!isAdminRoute) {
      document.documentElement.removeAttribute(
        "data-admin-theme",
      )

      document.documentElement.style.colorScheme =
        ""

      return
    }

    document.documentElement.setAttribute(
      "data-admin-theme",
      theme,
    )

    document.documentElement.style.colorScheme =
      theme

    window.localStorage.setItem(
      STORAGE_KEY,
      theme,
    )
  }, [
    isAdminRoute,
    theme,
  ])

  if (!isAdminRoute) {
    return null
  }

  const lightModeActive =
    theme === LIGHT_THEME

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === DARK_THEME
        ? LIGHT_THEME
        : DARK_THEME,
    )
  }

  return (
    <button
      type="button"
      className="admin-theme-toggle"
      onClick={toggleTheme}
      aria-pressed={lightModeActive}
      aria-label={
        lightModeActive
          ? "Ativar modo escuro"
          : "Ativar modo claro"
      }
      title={
        lightModeActive
          ? "Ativar modo escuro"
          : "Ativar modo claro"
      }
    >
      <span
        className="admin-theme-toggle__icon"
        aria-hidden="true"
      >
        {lightModeActive
          ? "🌙"
          : "☀️"}
      </span>

      <span className="admin-theme-toggle__label">
        {lightModeActive
          ? "Modo escuro"
          : "Modo claro"}
      </span>
    </button>
  )
}

export default AdminThemeToggle