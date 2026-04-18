import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { notify } from "../utils/swal"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        await notify.registered()
        navigate("/login")
      } else {
        notify.error("Ошибка регистрации", data.message || "Ошибка при регистрации")
      }
    } catch {
      notify.error("Ошибка соединения", "Не удалось соединиться с сервером")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #080810 0%, #0F0E1A 50%, #080810 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(196,154,80,0.07) 0%, transparent 70%)", top: -200, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(184,120,104,0.05) 0%, transparent 70%)", bottom: -100, left: "10%", pointerEvents: "none" }} />

      <div className="animate-scaleUp" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

        {/* Назад */}
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "rgba(196,154,80,0.6)", textDecoration: "none",
          fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", marginBottom: 40,
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C49A50"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(196,154,80,0.6)"}
        >
          <i className="fas fa-arrow-left" style={{ fontSize: 10 }} />
          На главную
        </Link>

        {/* Логотип ELIXIR */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            width: 80, height: 80,
            border: "1px solid rgba(196,154,80,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 7, border: "1px solid rgba(196,154,80,0.15)" }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28, fontWeight: 300, fontStyle: "italic",
              color: "#C49A50", letterSpacing: 2, position: "relative", zIndex: 1,
            }}>El</span>
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: 24,
            color: "#E8CE90", letterSpacing: 10, fontWeight: 400, margin: "0 0 8px",
          }}>ELIXIR</h1>
          <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, #C49A50, transparent)", margin: "0 auto 10px" }} />
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: 8.5,
            letterSpacing: 4, textTransform: "uppercase",
            color: "rgba(196,154,80,0.45)", fontWeight: 400,
          }}>Создать аккаунт</p>
        </div>

        {/* Форма */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(196,154,80,0.15)",
          padding: "40px 40px 36px",
          position: "relative",
        }}>
          {/* Уголки */}
          {[
            { top: -1, left: -1, borderWidth: "1px 0 0 1px" },
            { top: -1, right: -1, borderWidth: "1px 1px 0 0" },
            { bottom: -1, left: -1, borderWidth: "0 0 1px 1px" },
            { bottom: -1, right: -1, borderWidth: "0 1px 1px 0" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 14, height: 14, borderColor: "rgba(196,154,80,0.5)", borderStyle: "solid", ...s }} />
          ))}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={{
                fontFamily: "'Jost', sans-serif", fontSize: 8.5, letterSpacing: 3,
                textTransform: "uppercase", color: "rgba(196,154,80,0.5)",
                display: "block", marginBottom: 10,
              }}>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required disabled={loading}
                placeholder="your@email.com"
                className="input-dark"
              />
            </div>
            <div>
              <label style={{
                fontFamily: "'Jost', sans-serif", fontSize: 8.5, letterSpacing: 3,
                textTransform: "uppercase", color: "rgba(196,154,80,0.5)",
                display: "block", marginBottom: 10,
              }}>Пароль</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required disabled={loading}
                placeholder="••••••••"
                className="input-dark"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", marginTop: 6,
                padding: "14px",
                background: loading ? "rgba(196,154,80,0.3)" : "linear-gradient(135deg, #8A6A2C, #C49A50, #E8CE90)",
                border: "none", color: "#080810",
                fontFamily: "'Jost', sans-serif", fontSize: 9.5,
                letterSpacing: 4, textTransform: "uppercase",
                fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <div style={{ height: 1, background: "rgba(196,154,80,0.1)", margin: "28px 0" }} />

          <p style={{
            textAlign: "center", fontFamily: "'Jost', sans-serif",
            fontSize: 11, color: "rgba(234,226,214,0.35)", letterSpacing: 0.5,
          }}>
            Уже есть аккаунт?{" "}
            <Link to="/login" style={{ color: "#C49A50", textDecoration: "none", letterSpacing: 1 }}>
              Войти
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: "center", marginTop: 28,
          fontFamily: "'Cinzel', serif", fontSize: 7.5,
          letterSpacing: 5, color: "rgba(196,154,80,0.2)",
        }}>MAISON DE PARFUM</p>
      </div>
    </div>
  )
}
