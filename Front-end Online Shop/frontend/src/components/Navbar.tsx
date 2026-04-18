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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
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

        {/* Gold accent line */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #1A0A2E 0%, #C9A96E 30%, #F5E6C8 50%, #C9A96E 70%, #1A0A2E 100%)"
        }} />

        <nav
          className={scrolled ? "navbar-scrolled" : ""}
          style={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E8DDD0",
            padding: scrolled ? "10px 40px" : "16px 40px",
            transition: "padding 0.35s ease",
          }}
        >
          <div className="navbar-inner" style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 24 }}>

            {/* Logo */}
            <Link to="/" className="navbar-logo" style={{
              textDecoration: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 0, flexShrink: 0
            }}>
              <img src="/image.png" alt="ELIXIR" style={{
                width: scrolled ? 32 : 44,
                height: scrolled ? 32 : 44,
                objectFit: "contain",
                transition: "all 0.35s"
              }} />
              <span style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontSize: scrolled ? 14 : 20,
                letterSpacing: 8,
                color: "#1A0A2E",
                fontWeight: 500,
                lineHeight: 1,
                transition: "font-size 0.35s",
                marginTop: 3,
              }}>ELIXIR</span>
              <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, #C9A96E, transparent)", margin: "3px 0" }} />
              <span style={{ fontSize: 5.5, letterSpacing: 3.5, color: "#C9A96E", fontFamily: "Montserrat", textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 600 }}>
                Maison de Parfum
              </span>
            </Link>

            {/* Desktop filters (home only) */}
            {isHome && (
              <div className="nav-desktop-filters" style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 2, minWidth: 100 }}>
                  <i className="fas fa-search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#C9A96E", pointerEvents: "none" }} />
                  <input
                    className="nav-filter"
                    placeholder="Поиск ароматов..."
                    value={searchParams.get("search") || ""}
                    onChange={e => updateFilter("search", e.target.value)}
                    style={{ paddingLeft: "32px !important" as any }}
                  />
                </div>
                <select
                  className="nav-filter"
                  value={searchParams.get("category") || ""}
                  onChange={e => updateFilter("category", e.target.value)}
                  style={{ flex: 1, minWidth: 140 }}
                >
                  <option value="">Все категории</option>
                  <option value="Мужские">Мужские</option>
                  <option value="Женские">Женские</option>
                  <option value="Унисекс">Унисекс</option>
                  <option value="Подарочные наборы">Подарочные наборы</option>
                </select>
                <input
                  className="nav-filter"
                  type="number"
                  placeholder="от сом."
                  value={searchParams.get("minPrice") || ""}
                  onChange={e => updateFilter("minPrice", e.target.value)}
                  style={{ width: 80 }}
                />
                <input
                  className="nav-filter"
                  type="number"
                  placeholder="до сом."
                  value={searchParams.get("maxPrice") || ""}
                  onChange={e => updateFilter("maxPrice", e.target.value)}
                  style={{ width: 80 }}
                />
              </div>
            )}
            {!isHome && <div style={{ flex: 1 }} />}

            {/* Desktop right icons */}
            {!isAdmin && (
              <div className="nav-desktop-right" style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>

                {/* Cart */}
                <Link to="/cart" style={{
                  position: "relative", textDecoration: "none",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "transform 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
                >
                  <i className="fas fa-shopping-bag" style={{ fontSize: 18, color: "#1A0A2E" }} />
                  <span style={{ fontSize: 6, letterSpacing: 2.5, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600 }}>Корзина</span>
                  {totalCount > 0 && (
                    <span className="animate-scaleUp" style={{
                      position: "absolute", top: -5, right: -8,
                      backgroundColor: "#C9A96E", color: "#1A0A2E",
                      borderRadius: "50%", width: 16, height: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 700,
                    }}>{totalCount}</span>
                  )}
                </Link>

                <div style={{ width: 1, height: 30, background: "linear-gradient(180deg, transparent, #E8DDD0, transparent)" }} />

                {/* Profile */}
                {token ? (
                  <div ref={profileRef} style={{ position: "relative" }}>
                    <button onClick={() => setShowProfile(v => !v)} title="Профиль" style={{
                      width: 40, height: 40,
                      border: showProfile ? "1px solid #C9A96E" : "1px solid #E8DDD0",
                      background: showProfile ? "#1A0A2E" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E"; (e.currentTarget as HTMLElement).style.background = "#1A0A2E"; }}
                      onMouseLeave={e => {
                        if (!showProfile) {
                          (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }
                      }}
                    >
                      <i className="fas fa-user" style={{ fontSize: 14, color: showProfile ? "#C9A96E" : "#1A0A2E", transition: "color 0.25s" }} />
                    </button>
                    <span style={{ fontSize: 6, letterSpacing: 2, color: "#C9A96E", fontFamily: "Montserrat", textTransform: "uppercase", display: "block", textAlign: "center", marginTop: 4, fontWeight: 600 }}>Профиль</span>

                    {showProfile && (
                      <div className="animate-scaleUp" style={{
                        position: "absolute", right: 0, top: "calc(100% + 12px)",
                        backgroundColor: "#FFFFFF", border: "1px solid #E8DDD0",
                        width: 240, zIndex: 200, boxShadow: "0 20px 60px rgba(26,10,46,0.15)",
                      }}>
                        <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid #F0E8D8", background: "#FAF7F2" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 34, height: 34, background: "#1A0A2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <i className="fas fa-user" style={{ fontSize: 13, color: "#C9A96E" }} />
                            </div>
                            <div style={{ overflow: "hidden" }}>
                              <p style={{ fontSize: 7, letterSpacing: 2.5, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", marginBottom: 3, fontWeight: 600 }}>
                                {role === "ADMIN" ? "Администратор" : "Покупатель"}
                              </p>
                              <p style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Montserrat", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                              color: "#4A4040", fontFamily: "Montserrat", fontSize: 10,
                              letterSpacing: 1.5, textTransform: "uppercase",
                              borderBottom: "1px solid #F0E8D8", transition: "background 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
                          >
                            <i className={`fas ${item.icon}`} style={{ fontSize: 13, width: 15, color: "#C9A96E" }} />
                            {item.label}
                          </Link>
                        ))}

                        <button onClick={handleLogout} style={{
                          width: "100%", padding: "12px 20px",
                          display: "flex", alignItems: "center", gap: 14,
                          fontFamily: "Montserrat", fontSize: 10, letterSpacing: 1.5,
                          textTransform: "uppercase", color: "#8A7F75",
                          background: "none", border: "none", cursor: "pointer",
                          textAlign: "left", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FAF7F2"; (e.currentTarget as HTMLElement).style.color = "#1A0A2E"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8A7F75"; }}
                        >
                          <i className="fas fa-sign-out-alt" style={{ fontSize: 13, width: 15 }} />
                          Выйти
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link to="/login" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 40, height: 40, border: "1px solid #E8DDD0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.25s", cursor: "pointer", background: "transparent"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1A0A2E"; (e.currentTarget as HTMLElement).style.background = "#1A0A2E"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <i className="fas fa-user" style={{ fontSize: 14, color: "#1A0A2E" }} />
                      </div>
                      <span style={{ fontSize: 6, letterSpacing: 2, color: "#8A7F75", fontFamily: "Montserrat", textTransform: "uppercase", fontWeight: 600 }}>Войти</span>
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 40, height: 40, background: "#1A0A2E",
                        border: "1px solid #1A0A2E",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.25s", cursor: "pointer"
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1A0A2E"; (e.currentTarget as HTMLElement).style.borderColor = "#1A0A2E"; }}
                      >
                        <i className="fas fa-user-plus" style={{ fontSize: 13, color: "#C9A96E" }} />
                      </div>
                      <span style={{ fontSize: 6, letterSpacing: 2, color: "#8A7F75", fontFamily: "Montserrat", textTransform: "uppercase", fontWeight: 600 }}>Регистрация</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Burger */}
            {!isAdmin && (
              <button
                className={`burger-btn${mobileOpen ? " open" : ""}`}
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Меню"
              >
                <span /><span /><span />
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-drawer scroll-touch">

          <div className="drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/image.png" alt="ELIXIR" style={{ width: 30, height: 30, objectFit: "contain" }} />
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#1A0A2E", letterSpacing: 5, fontWeight: 500 }}>ELIXIR</span>
                <div style={{ fontSize: 5.5, letterSpacing: 3, color: "#C9A96E", fontFamily: "Montserrat", textTransform: "uppercase", marginTop: 2, fontWeight: 600 }}>Maison de Parfum</div>
              </div>
            </div>
            <button className="drawer-close" onClick={() => setMobileOpen(false)} aria-label="Закрыть">
              <i className="fas fa-times" style={{ fontSize: 13, color: "#1A0A2E" }} />
            </button>
          </div>

          {isHome && (
            <div className="drawer-filters">
              <p style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 8 }}>Поиск</p>
              <input
                placeholder="Поиск ароматов..."
                value={searchParams.get("search") || ""}
                onChange={e => updateFilter("search", e.target.value)}
              />
              <select
                value={searchParams.get("category") || ""}
                onChange={e => { updateFilter("category", e.target.value); if (e.target.value) setMobileOpen(false); }}
              >
                <option value="">Все категории</option>
                <option value="Мужские">Мужские</option>
                <option value="Женские">Женские</option>
                <option value="Унисекс">Унисекс</option>
                <option value="Подарочные наборы">Подарочные наборы</option>
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number" placeholder="от сом."
                  value={searchParams.get("minPrice") || ""}
                  onChange={e => updateFilter("minPrice", e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="number" placeholder="до сом."
                  value={searchParams.get("maxPrice") || ""}
                  onChange={e => updateFilter("maxPrice", e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          )}

          <div className="drawer-section">
            <p style={{ fontSize: 7.5, letterSpacing: 4, textTransform: "uppercase", color: "#8A7F75", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 14 }}>Навигация</p>
            <Link to="/" className="drawer-link" onClick={() => setMobileOpen(false)}>
              <i className="fas fa-home" style={{ fontSize: 13, width: 16 }} />
              Каталог
            </Link>
            <Link to="/cart" className="drawer-link" onClick={() => setMobileOpen(false)}>
              <i className="fas fa-shopping-bag" style={{ fontSize: 13, width: 16 }} />
              Корзина
              {totalCount > 0 && (
                <span style={{ marginLeft: "auto", backgroundColor: "#C9A96E", color: "#1A0A2E", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{totalCount}</span>
              )}
            </Link>
            {token && (
              <Link to="/orderHistory" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <i className="fas fa-scroll" style={{ fontSize: 13, width: 16 }} />
                Мои заказы
              </Link>
            )}
            {token && role === "ADMIN" && (
              <Link to="/admin" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <i className="fas fa-cog" style={{ fontSize: 13, width: 16 }} />
                Панель Админа
              </Link>
            )}
          </div>

          <div className="drawer-section">
            {token ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F0E8D8" }}>
                  <div style={{ width: 36, height: 36, background: "#1A0A2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className="fas fa-user" style={{ fontSize: 13, color: "#C9A96E" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 7, letterSpacing: 2.5, color: "#C9A96E", fontFamily: "Montserrat", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>{role === "ADMIN" ? "Администратор" : "Покупатель"}</p>
                    <p style={{ fontSize: 11, color: "#1A1A1A", fontFamily: "Montserrat", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{user?.email || "Мой аккаунт"}</p>
                  </div>
                </div>
                <button onClick={handleLogout} style={{ width: "100%", padding: "12px 0", display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", color: "#8A7F75", fontFamily: "Montserrat", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
                  <i className="fas fa-sign-out-alt" style={{ fontSize: 13 }} />
                  Выйти
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link to="/login" className="btn-primary" style={{ textAlign: "center", display: "block" }} onClick={() => setMobileOpen(false)}>Войти</Link>
                <Link to="/register" className="btn-secondary" style={{ textAlign: "center", display: "block" }} onClick={() => setMobileOpen(false)}>Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
