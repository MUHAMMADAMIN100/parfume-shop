import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import type { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { parseJwt } from "../utils/jwt";

export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { token, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const user = parseJwt(token);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowProfile(false);
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="animate-navSlideDown navbar-sticky" style={{ position: "sticky", top: 0, zIndex: 100 }}>

        {/* ── Top gold line ── */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, #C49A50 20%, #E8CE90 50%, #C49A50 80%, transparent 100%)",
        }} />

        {/* ── Main nav bar ── */}
        <nav
          className={scrolled ? "navbar-scrolled" : ""}
          style={{
            background: scrolled
              ? "rgba(8,8,16,0.96)"
              : "#080810",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
            padding: scrolled ? "10px 40px" : "16px 40px",
            transition: "padding 0.35s ease, background 0.35s ease",
            borderBottom: "1px solid rgba(196,154,80,0.1)",
          }}
        >
          <div className="navbar-inner" style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 28 }}>

            {/* Logo */}
            <Link to="/" className="navbar-logo" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 2 }}>
              <img src="/image.png" alt="ELIXIR" style={{
                width: scrolled ? 28 : 40,
                height: scrolled ? 28 : 40,
                objectFit: "contain",
                transition: "all 0.35s",
                filter: "brightness(0) saturate(100%) invert(78%) sepia(30%) saturate(500%) hue-rotate(10deg) brightness(105%)",
              }} />
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: scrolled ? 11 : 15,
                letterSpacing: 7,
                color: "#E8CE90",
                fontWeight: 500,
                lineHeight: 1,
                transition: "font-size 0.35s",
              }}>ELIXIR</span>
              <span style={{
                fontSize: 5,
                letterSpacing: 3.5,
                color: "rgba(196,154,80,0.5)",
                fontFamily: "'Jost', sans-serif",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                fontWeight: 400,
              }}>
                Maison de Parfum
              </span>
            </Link>

            {/* Desktop filters */}
            {isHome && (
              <div className="nav-desktop-filters" style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 2, minWidth: 120 }}>
                  <i className="fas fa-search" style={{
                    position: "absolute", left: 12, top: "50%",
                    transform: "translateY(-50%)", fontSize: 10,
                    color: "rgba(196,154,80,0.6)", pointerEvents: "none",
                  }} />
                  <input
                    className="nav-filter"
                    placeholder="Поиск ароматов..."
                    value={searchParams.get("search") || ""}
                    onChange={e => updateFilter("search", e.target.value)}
                    style={{ paddingLeft: 34 }}
                  />
                </div>
                <select className="nav-filter"
                  value={searchParams.get("category") || ""}
                  onChange={e => updateFilter("category", e.target.value)}
                  style={{ flex: 1, minWidth: 150 }}
                >
                  <option value="">Все категории</option>
                  <option value="Мужские">Мужские</option>
                  <option value="Женские">Женские</option>
                  <option value="Унисекс">Унисекс</option>
                  <option value="Подарочные наборы">Подарочные наборы</option>
                </select>
                <input className="nav-filter" type="number" placeholder="от сом."
                  value={searchParams.get("minPrice") || ""}
                  onChange={e => updateFilter("minPrice", e.target.value)}
                  style={{ width: 84 }}
                />
                <input className="nav-filter" type="number" placeholder="до сом."
                  value={searchParams.get("maxPrice") || ""}
                  onChange={e => updateFilter("maxPrice", e.target.value)}
                  style={{ width: 84 }}
                />
              </div>
            )}
            {!isHome && <div style={{ flex: 1 }} />}

            {/* Desktop right */}
            {!isAdmin && (
              <div className="nav-desktop-right" style={{ display: "flex", alignItems: "center", gap: 22, flexShrink: 0 }}>

                {/* Cart */}
                <Link to="/cart" style={{
                  position: "relative", textDecoration: "none",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                >
                  <i className="fas fa-shopping-bag" style={{ fontSize: 17, color: "#D4AE6A" }} />
                  <span style={{ fontSize: 6, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(196,154,80,0.6)", fontFamily: "'Jost'", fontWeight: 500 }}>Корзина</span>
                  {totalCount > 0 && (
                    <span className="animate-scaleUp" style={{
                      position: "absolute", top: -5, right: -8,
                      background: "linear-gradient(135deg, #C49A50, #E8CE90)",
                      color: "#080810",
                      borderRadius: "50%", width: 16, height: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 700,
                    }}>{totalCount}</span>
                  )}
                </Link>

                <div style={{ width: 1, height: 28, background: "rgba(196,154,80,0.15)" }} />

                {/* Profile */}
                {token ? (
                  <div ref={profileRef} style={{ position: "relative" }}>
                    <button onClick={() => setShowProfile(v => !v)} style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      background: "none", border: "none", cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    >
                      <div style={{
                        width: 32, height: 32,
                        border: `1px solid ${showProfile ? "#C49A50" : "rgba(196,154,80,0.3)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: showProfile ? "rgba(196,154,80,0.1)" : "transparent",
                        transition: "all 0.25s",
                      }}>
                        <i className="fas fa-user" style={{ fontSize: 13, color: "#D4AE6A" }} />
                      </div>
                      <span style={{ fontSize: 6, letterSpacing: 2.5, color: "rgba(196,154,80,0.6)", fontFamily: "'Jost'", textTransform: "uppercase", fontWeight: 500 }}>Профиль</span>
                    </button>

                    {showProfile && (
                      <div className="animate-scaleUp" style={{
                        position: "absolute", right: 0, top: "calc(100% + 14px)",
                        background: "#FFFFFF",
                        border: "1px solid #DDD0BE",
                        width: 240, zIndex: 200,
                        boxShadow: "0 24px 80px rgba(8,8,16,0.2)",
                      }}>
                        <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid #EDE5D8", background: "#F5F0E8" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <i className="fas fa-user" style={{ fontSize: 13, color: "#C49A50" }} />
                            </div>
                            <div style={{ overflow: "hidden" }}>
                              <p style={{ fontSize: 7, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A50", fontFamily: "'Jost'", marginBottom: 3, fontWeight: 500 }}>
                                {role === "ADMIN" ? "Администратор" : "Покупатель"}
                              </p>
                              <p style={{ fontSize: 11, color: "#1A1410", fontFamily: "'Jost'", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user?.email || "Мой аккаунт"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {([
                          { to: "/cart", icon: "fa-shopping-bag", label: "Моя корзина" },
                          { to: "/orderHistory", icon: "fa-scroll", label: "Мои заказы" },
                          ...(role === "ADMIN" ? [{ to: "/admin", icon: "fa-cog", label: "Панель Админа" }] : [])
                        ] as { to: string; icon: string; label: string }[]).map(item => (
                          <Link key={item.to} to={item.to} className="profile-link" onClick={() => setShowProfile(false)}
                            style={{
                              display: "flex", alignItems: "center", gap: 14,
                              padding: "12px 20px", textDecoration: "none",
                              color: "#5A5048", fontFamily: "'Jost'", fontSize: 10,
                              letterSpacing: 1.5, textTransform: "uppercase",
                              borderBottom: "1px solid #EDE5D8", transition: "background 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F0E8"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                          >
                            <i className={`fas ${item.icon}`} style={{ fontSize: 12, width: 14, color: "#C49A50" }} />
                            {item.label}
                          </Link>
                        ))}
                        <button onClick={handleLogout} style={{
                          width: "100%", padding: "12px 20px",
                          display: "flex", alignItems: "center", gap: 14,
                          fontFamily: "'Jost'", fontSize: 10, letterSpacing: 1.5,
                          textTransform: "uppercase", color: "#9A9080",
                          background: "none", border: "none", cursor: "pointer",
                          textAlign: "left", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F5F0E8"; (e.currentTarget as HTMLElement).style.color = "#1A1410"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9A9080"; }}
                        >
                          <i className="fas fa-sign-out-alt" style={{ fontSize: 12, width: 14 }} />
                          Выйти
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <button style={{
                        padding: "9px 20px",
                        border: "1px solid rgba(196,154,80,0.3)",
                        background: "transparent",
                        color: "rgba(234,226,214,0.8)",
                        fontFamily: "'Jost'", fontSize: 9.5, letterSpacing: 2.5,
                        textTransform: "uppercase", cursor: "pointer",
                        transition: "all 0.25s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C49A50"; (e.currentTarget as HTMLElement).style.color = "#E8CE90"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,154,80,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(234,226,214,0.8)"; }}
                      >
                        Войти
                      </button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                      <button style={{
                        padding: "9px 20px",
                        background: "linear-gradient(135deg, #8A6A2C, #C49A50)",
                        border: "1px solid #C49A50",
                        color: "#080810",
                        fontFamily: "'Jost'", fontSize: 9.5, letterSpacing: 2.5,
                        textTransform: "uppercase", cursor: "pointer",
                        transition: "all 0.25s",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #C49A50, #E8CE90)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #8A6A2C, #C49A50)"}
                      >
                        Регистрация
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Burger */}
            {!isAdmin && (
              <button className={`burger-btn${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(v => !v)} aria-label="Меню">
                <span /><span /><span />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="mobile-drawer scroll-touch">
          <div className="drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/image.png" alt="ELIXIR" style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) saturate(100%) invert(78%) sepia(30%) saturate(500%) hue-rotate(10deg) brightness(105%)" }} />
              <div>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "#E8CE90", letterSpacing: 6, fontWeight: 500 }}>ELIXIR</span>
                <div style={{ fontSize: 5, letterSpacing: 3, color: "rgba(196,154,80,0.5)", fontFamily: "'Jost'", textTransform: "uppercase", marginTop: 2 }}>Maison de Parfum</div>
              </div>
            </div>
            <button className="drawer-close" onClick={() => setMobileOpen(false)}>
              <i className="fas fa-times" style={{ fontSize: 12, color: "rgba(234,226,214,0.6)" }} />
            </button>
          </div>

          {isHome && (
            <div className="drawer-filters">
              <p style={{ fontSize: 7.5, letterSpacing: 4, textTransform: "uppercase", color: "#C49A50", fontFamily: "'Jost'", fontWeight: 500, marginBottom: 10 }}>Поиск</p>
              <input placeholder="Поиск ароматов..." value={searchParams.get("search") || ""} onChange={e => updateFilter("search", e.target.value)} className="input-dark" />
              <select value={searchParams.get("category") || ""} onChange={e => { updateFilter("category", e.target.value); if (e.target.value) setMobileOpen(false); }} className="input-dark">
                <option value="">Все категории</option>
                <option value="Мужские">Мужские</option>
                <option value="Женские">Женские</option>
                <option value="Унисекс">Унисекс</option>
                <option value="Подарочные наборы">Подарочные наборы</option>
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" placeholder="от сом." value={searchParams.get("minPrice") || ""} onChange={e => updateFilter("minPrice", e.target.value)} style={{ flex: 1 }} className="input-dark" />
                <input type="number" placeholder="до сом." value={searchParams.get("maxPrice") || ""} onChange={e => updateFilter("maxPrice", e.target.value)} style={{ flex: 1 }} className="input-dark" />
              </div>
            </div>
          )}

          <div className="drawer-section">
            <p style={{ fontSize: 7.5, letterSpacing: 4.5, textTransform: "uppercase", color: "rgba(196,154,80,0.5)", fontFamily: "'Jost'", fontWeight: 500, marginBottom: 16 }}>Навигация</p>
            <Link to="/" className="drawer-link" onClick={() => setMobileOpen(false)}><i className="fas fa-home" />Каталог</Link>
            <Link to="/cart" className="drawer-link" onClick={() => setMobileOpen(false)}>
              <i className="fas fa-shopping-bag" />Корзина
              {totalCount > 0 && (
                <span style={{ marginLeft: "auto", background: "linear-gradient(135deg, #C49A50, #E8CE90)", color: "#080810", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{totalCount}</span>
              )}
            </Link>
            {token && <Link to="/orderHistory" className="drawer-link" onClick={() => setMobileOpen(false)}><i className="fas fa-scroll" />Мои заказы</Link>}
            {token && role === "ADMIN" && <Link to="/admin" className="drawer-link" onClick={() => setMobileOpen(false)}><i className="fas fa-cog" />Панель Админа</Link>}
          </div>

          <div className="drawer-section">
            {token ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(196,154,80,0.1)" }}>
                  <div style={{ width: 36, height: 36, background: "rgba(196,154,80,0.1)", border: "1px solid rgba(196,154,80,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="fas fa-user" style={{ fontSize: 13, color: "#C49A50" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 7, letterSpacing: 3, color: "#C49A50", fontFamily: "'Jost'", textTransform: "uppercase", margin: 0, fontWeight: 500 }}>{role === "ADMIN" ? "Администратор" : "Покупатель"}</p>
                    <p style={{ fontSize: 11, color: "#EAE2D6", fontFamily: "'Jost'", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ width: "100%", padding: "10px 0", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", color: "#8A8070", fontFamily: "'Jost'", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase" }}>
                  <i className="fas fa-sign-out-alt" style={{ fontSize: 12, color: "#C49A50" }} />Выйти
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: "block", textAlign: "center", padding: "13px", background: "linear-gradient(135deg, #8A6A2C, #C49A50)", color: "#080810", fontFamily: "'Jost'", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none" }}>Войти</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ display: "block", textAlign: "center", padding: "12px", border: "1px solid rgba(196,154,80,0.3)", color: "rgba(234,226,214,0.8)", fontFamily: "'Jost'", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none" }}>Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
