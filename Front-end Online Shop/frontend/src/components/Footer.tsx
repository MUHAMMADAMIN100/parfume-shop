import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#080810", color: "#7A7060", fontFamily: "'Jost', sans-serif" }}>

      {/* Top gold line */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C49A50 30%, #E8CE90 50%, #C49A50 70%, transparent)" }} />

      {/* Newsletter */}
      <div style={{
        background: "linear-gradient(135deg, #0F0E1A 0%, #080810 60%)",
        borderBottom: "1px solid rgba(196,154,80,0.1)",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "48px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 5, color: "rgba(196,154,80,0.5)", marginBottom: 10, fontWeight: 400 }}>
              ELIXIR NEWSLETTER
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#EAE2D6", fontWeight: 300, letterSpacing: 2, lineHeight: 1.2 }}>
              Первыми узнавайте о новинках
            </p>
          </div>
          <div style={{ display: "flex", gap: 0, flexShrink: 0 }}>
            <input
              type="email"
              placeholder="Ваш email адрес"
              className="footer-email-input"
            />
            <button style={{
              padding: "13px 24px",
              background: "linear-gradient(135deg, #8A6A2C, #C49A50)",
              border: "none", color: "#080810",
              fontFamily: "'Jost'", fontSize: 9, letterSpacing: 3,
              textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #C49A50, #E8CE90)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #8A6A2C, #C49A50)"}
            >
              Подписаться
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "#E8CE90", letterSpacing: 8, fontWeight: 400, marginBottom: 4 }}>ELIXIR</p>
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #C49A50, transparent)", marginBottom: 8 }} />
            <p style={{ fontFamily: "'Jost'", fontSize: 7, letterSpacing: 4, textTransform: "uppercase", color: "rgba(196,154,80,0.4)", fontWeight: 400 }}>Maison de Parfum</p>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.9, color: "#5A5048", maxWidth: 210, fontWeight: 300 }}>
            Каждый аромат — это история, рассказанная нотами. Мы помогаем найти ваш неповторимый запах.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            {[
              { title: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { title: "Telegram", path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
              { title: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" },
            ].map(item => (
              <a key={item.title} href="#" title={item.title} style={{
                width: 34, height: 34,
                border: "1px solid rgba(196,154,80,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", color: "#4A4540",
                transition: "all 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C49A50"; (e.currentTarget as HTMLElement).style.color = "#C49A50"; (e.currentTarget as HTMLElement).style.background = "rgba(196,154,80,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,154,80,0.15)"; (e.currentTarget as HTMLElement).style.color = "#4A4540"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: 4, textTransform: "uppercase", color: "#E8CE90", fontWeight: 400, marginBottom: 24 }}>
            Каталог
          </h4>
          {[
            { label: "Все ароматы", to: "/" },
            { label: "Мужские", to: "/?category=%D0%9C%D1%83%D0%B6%D1%81%D0%BA%D0%B8%D0%B5" },
            { label: "Женские", to: "/?category=%D0%96%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B5" },
            { label: "Унисекс", to: "/?category=%D0%A3%D0%BD%D0%B8%D1%81%D0%B5%D0%BA%D1%81" },
            { label: "Подарочные наборы", to: "/?category=%D0%9F%D0%BE%D0%B4%D0%B0%D1%80%D0%BE%D1%87%D0%BD%D1%8B%D0%B5+%D0%BD%D0%B0%D0%B1%D0%BE%D1%80%D1%8B" },
            { label: "Корзина", to: "/cart" },
            { label: "Мои заказы", to: "/orderHistory" },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{ display: "block", fontFamily: "'Jost'", fontSize: 12, fontWeight: 300, color: "#5A5048", textDecoration: "none", marginBottom: 12, letterSpacing: 0.5, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C49A50"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#5A5048"}
            >{link.label}</Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: 4, textTransform: "uppercase", color: "#E8CE90", fontWeight: 400, marginBottom: 24 }}>
            Контакты
          </h4>
          {[
            { icon: "fa-map-marker-alt", label: "Адрес", value: "ул. Парфюмерная, 1" },
            { icon: "fa-phone", label: "Телефон", value: "+996 (700) 123-456" },
            { icon: "fa-envelope", label: "Email", value: "info@elixir.kg" },
            { icon: "fa-clock", label: "Часы работы", value: "Пн–Вс: 9:00 – 21:00" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, border: "1px solid rgba(196,154,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <i className={`fas ${item.icon}`} style={{ fontSize: 10, color: "#C49A50" }} />
              </div>
              <div>
                <p style={{ fontSize: 7.5, letterSpacing: 2.5, textTransform: "uppercase", color: "#3A3530", margin: 0, marginBottom: 4, fontWeight: 500 }}>{item.label}</p>
                <p style={{ fontSize: 11.5, color: "#5A5048", margin: 0, fontWeight: 300 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Brands */}
        <div>
          <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: 4, textTransform: "uppercase", color: "#E8CE90", fontWeight: 400, marginBottom: 24 }}>
            Наши бренды
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["Chanel", "Dior", "Tom Ford", "Creed", "Byredo", "Maison Margiela", "Giorgio Armani", "Calvin Klein"].map(brand => (
              <span key={brand} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 14, color: "#4A4540",
                letterSpacing: 1.5, cursor: "default",
                transition: "color 0.2s, letter-spacing 0.2s",
                fontWeight: 400,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#C49A50"; (e.currentTarget as HTMLElement).style.letterSpacing = "2.5px"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#4A4540"; (e.currentTarget as HTMLElement).style.letterSpacing = "1.5px"; }}
              >{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p style={{ fontSize: 9.5, color: "#2A2520", margin: 0, letterSpacing: 1.5, fontFamily: "'Jost'" }}>
          © {year} ELIXIR. Все права защищены.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 1, height: 14, background: "rgba(196,154,80,0.2)" }} />
          <p style={{ fontSize: 9.5, color: "#2A2520", margin: 0, letterSpacing: 2, fontFamily: "'Cinzel'" }}>
            Maison de Parfum
          </p>
        </div>
      </div>
    </footer>
  );
}
