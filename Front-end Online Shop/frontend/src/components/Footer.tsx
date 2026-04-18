import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0D0620", color: "#9A9080", fontFamily: "Montserrat" }}>

      {/* Gold top line */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, #C9A96E 30%, #F5E6C8 50%, #C9A96E 70%, transparent 100%)" }} />

      {/* Newsletter strip */}
      <div style={{ borderBottom: "1px solid rgba(201,169,110,0.1)", background: "rgba(201,169,110,0.04)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 8, letterSpacing: 4, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 5 }}>
              Эксклюзивные предложения
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#F5E6C8", fontWeight: 300, letterSpacing: 2 }}>
              Подпишитесь на новинки и акции ELIXIR
            </p>
          </div>
          <div style={{ display: "flex", gap: 0, flexShrink: 0 }}>
            <input
              type="email"
              placeholder="Ваш email"
              style={{
                width: 220, padding: "11px 16px", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(201,169,110,0.3)", borderRight: "none",
                color: "#F5E6C8", fontSize: 11, letterSpacing: 0.5,
                borderRadius: "0 !important" as any,
              }}
            />
            <button style={{
              padding: "11px 20px", background: "#C9A96E", border: "1px solid #C9A96E",
              color: "#1A0A2E", fontSize: 8.5, letterSpacing: 2.5, textTransform: "uppercase",
              fontFamily: "Montserrat", fontWeight: 700, cursor: "pointer", transition: "all 0.25s",
              whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5E6C8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; }}
            >
              Подписаться
            </button>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="footer-grid">

        {/* Brand column */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#F5E6C8", letterSpacing: 8, fontWeight: 300 }}>ELIXIR</span>
            </div>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, #C9A96E, transparent)", marginBottom: 8 }} />
            <p style={{ fontSize: 7.5, letterSpacing: 3.5, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600 }}>
              Maison de Parfum
            </p>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.9, color: "#706560", maxWidth: 200, fontWeight: 300 }}>
            Каждый аромат — это история, рассказанная нотами. Мы помогаем найти ваш неповторимый запах.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            {[
              {
                title: "Instagram",
                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>
              },
              {
                title: "Telegram",
                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              },
              {
                title: "WhatsApp",
                svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              },
            ].map(item => (
              <a key={item.title} href="#" title={item.title} style={{
                width: 32, height: 32, border: "1px solid rgba(201,169,110,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#706560", textDecoration: "none", transition: "all 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; (e.currentTarget as HTMLElement).style.background = "rgba(201,169,110,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.2)"; (e.currentTarget as HTMLElement).style.color = "#706560"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {item.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ fontSize: 8, letterSpacing: 4.5, textTransform: "uppercase", color: "#F5E6C8", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 22 }}>
            Навигация
          </h4>
          {[
            { label: "Каталог ароматов", to: "/" },
            { label: "Мужские", to: "/?category=%D0%9C%D1%83%D0%B6%D1%81%D0%BA%D0%B8%D0%B5" },
            { label: "Женские", to: "/?category=%D0%96%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B5" },
            { label: "Унисекс", to: "/?category=%D0%A3%D0%BD%D0%B8%D1%81%D0%B5%D0%BA%D1%81" },
            { label: "Подарочные наборы", to: "/?category=%D0%9F%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D1%87%D0%BD%D1%8B%D0%B5+%D0%BD%D0%B0%D0%B1%D0%BE%D1%80%D1%8B" },
            { label: "Корзина", to: "/cart" },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              display: "block", fontSize: 11, color: "#706560", textDecoration: "none",
              marginBottom: 11, transition: "color 0.2s", letterSpacing: 0.5, fontWeight: 300,
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C9A96E"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#706560"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 8, letterSpacing: 4.5, textTransform: "uppercase", color: "#F5E6C8", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 22 }}>
            Контакты
          </h4>
          {[
            { icon: "fa-map-marker-alt", label: "Адрес", value: "ул. Парфюмерная, 1" },
            { icon: "fa-phone", label: "Телефон", value: "+996 (700) 123-456" },
            { icon: "fa-envelope", label: "Email", value: "info@elixir.kg" },
            { icon: "fa-clock", label: "Режим работы", value: "Пн–Вс: 9:00 – 21:00" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
              <i className={`fas ${item.icon}`} style={{ fontSize: 12, color: "#C9A96E", marginTop: 2, flexShrink: 0, width: 14 }} />
              <div>
                <p style={{ fontSize: 7.5, letterSpacing: 2, textTransform: "uppercase", color: "#464040", margin: 0, marginBottom: 3, fontWeight: 600 }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#706560", margin: 0, fontWeight: 300 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div>
          <h4 style={{ fontSize: 8, letterSpacing: 4.5, textTransform: "uppercase", color: "#F5E6C8", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 22 }}>
            Наши бренды
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {["Chanel", "Dior", "Tom Ford", "Creed", "Byredo", "Maison Margiela", "Giorgio Armani", "Calvin Klein"].map(brand => (
              <span key={brand} style={{ fontSize: 12, color: "#706560", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, letterSpacing: 1, cursor: "default", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C9A96E"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#706560"}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom" style={{ borderTopColor: "rgba(201,169,110,0.1)" }}>
        <p style={{ fontSize: 9, color: "#3D3535", margin: 0, letterSpacing: 1.5 }}>
          © {year} ELIXIR. Все права защищены.
        </p>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 4, height: 4, background: "#C9A96E", borderRadius: "50%", opacity: 0.6 }} />
          <p style={{ fontSize: 9, color: "#3D3535", margin: 0, letterSpacing: 1.5, fontStyle: "italic" }}>
            Maison de Parfum
          </p>
        </div>
      </div>
    </footer>
  );
}
