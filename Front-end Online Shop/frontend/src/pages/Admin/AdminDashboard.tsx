import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import type { RootState, AppDispatch } from "../../app/store"
import axios from "axios"
import UsersManagement from "./UsersManagement"
import ProductsManagement from "./ProductsManagement"
import Analytics from "./Analytics"
import LoadingLogo from "../../components/LoadingLogo"

const NavItem = ({ to, label, sub, active }: { to: string; label: string; sub: string; active: boolean }) => (
  <Link to={to} style={{
    textDecoration: "none",
    background: active ? "linear-gradient(135deg, #8A6A2C, #C49A50)" : "transparent",
    border: active ? "1px solid #C49A50" : "1px solid rgba(196,154,80,0.2)",
    padding: "14px 28px",
    fontFamily: "'Jost', sans-serif", fontSize: 9.5, letterSpacing: 3,
    textTransform: "uppercase",
    color: active ? "#080810" : "rgba(196,154,80,0.6)",
    transition: "all 0.25s",
    display: "flex", flexDirection: "column", gap: 3, alignItems: "center",
    fontWeight: active ? 600 : 400,
  }}
    onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#C49A50"; el.style.color = "#C49A50"; el.style.background = "rgba(196,154,80,0.06)"; } }}
    onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,154,80,0.2)"; el.style.color = "rgba(196,154,80,0.6)"; el.style.background = "transparent"; } }}
  >
    <span style={{ fontSize: 7.5, letterSpacing: 3, color: active ? "rgba(8,8,16,0.6)" : "rgba(196,154,80,0.35)" }}>{sub}</span>
    {label}
  </Link>
)

const AdminDashboard: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateAdmin = async () => {
      if (!token || role !== "ADMIN") { dispatch(logout()); navigate("/login"); return; }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/validate-admin`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.status === 200) setLoading(false)
        else { dispatch(logout()); navigate("/login"); }
      } catch { dispatch(logout()); navigate("/login"); }
    }
    validateAdmin()
  }, [token, role, navigate, dispatch])

  const handleLogout = () => { dispatch(logout()); navigate("/login"); }

  if (loading) return <LoadingLogo height="100vh" />

  const navItems = [
    { to: "/admin/users",     label: "Пользователи", sub: "Управление" },
    { to: "/admin/products",  label: "Товары",        sub: "Каталог" },
    { to: "/admin/analytics", label: "Аналитика",     sub: "Статистика" },
  ]

  return (
    <div style={{ background: "#080810", minHeight: "100vh" }}>

      {/* Admin Header */}
      <div style={{
        background: "linear-gradient(90deg, #080810 0%, #0F0E1A 50%, #080810 100%)",
        borderBottom: "1px solid rgba(196,154,80,0.15)",
        padding: "clamp(14px,3vw,20px) clamp(16px,4vw,48px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        {/* Gold top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C49A50 30%, #E8CE90 50%, #C49A50 70%, transparent)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Monogram */}
          <div style={{
            width: 42, height: 42,
            border: "1px solid rgba(196,154,80,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 5, border: "1px solid rgba(196,154,80,0.15)" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, fontStyle: "italic", color: "#C49A50", position: "relative", zIndex: 1 }}>El</span>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Cinzel', serif", color: "#E8CE90", fontSize: 18, letterSpacing: 8, fontWeight: 400, margin: 0 }}>ELIXIR</h1>
            <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(196,154,80,0.4)", fontSize: 8, letterSpacing: 3.5, textTransform: "uppercase", margin: 0 }}>Панель администратора</p>
          </div>
        </div>

        <button onClick={handleLogout} style={{
          border: "1px solid rgba(196,154,80,0.3)",
          color: "rgba(196,154,80,0.7)", padding: "9px 24px",
          fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", cursor: "pointer", background: "transparent",
          transition: "all 0.25s",
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#C49A50"; el.style.color = "#C49A50"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,154,80,0.3)"; el.style.color = "rgba(196,154,80,0.7)"; }}
        >
          Выйти
        </button>
      </div>

      <div className="admin-wrapper" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px" }}>
        {/* Навигация */}
        <nav className="admin-nav" style={{ display: "flex", gap: 2, marginBottom: 24, flexWrap: "wrap" }}>
          {navItems.map(item => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              sub={item.sub}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        {/* Контент */}
        <div style={{
          background: "#F5F0E8",
          border: "1px solid rgba(196,154,80,0.2)",
          padding: "32px",
        }}>
          <Routes>
            <Route path="/users"     element={<UsersManagement />} />
            <Route path="/products"  element={<ProductsManagement />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
