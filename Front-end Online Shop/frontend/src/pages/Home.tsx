import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingLogo from "../components/LoadingLogo";
import { cacheGet, cacheSet } from "../utils/cache";

const PRODUCTS_CACHE = "products";
const CATEGORIES = ["Все", "Мужские", "Женские", "Унисекс", "Подарочные наборы"];

export default function Home() {
  const [products, setProducts] = useState<any[]>(() => cacheGet<any[]>(PRODUCTS_CACHE) ?? []);
  const [loading, setLoading] = useState(() => !cacheGet(PRODUCTS_CACHE));
  const [searchParams, setSearchParams] = useSearchParams();

  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => { setProducts(res.data); cacheSet(PRODUCTS_CACHE, res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand?.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "Все") next.delete("category");
    else next.set("category", cat);
    setSearchParams(next);
  };

  const activeCategory = category || "Все";

  if (loading) return <LoadingLogo height="80vh" />;

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />

        <div className="hero-content">
          {/* Left: text */}
          <div>
            <div className="hero-tag">
              L'Art du Parfum
            </div>

            <h1 className="hero-title">
              Откройте мир<br />
              <em>изысканных</em><br />
              ароматов
            </h1>

            <p className="hero-subtitle">
              Премиальная парфюмерия от легендарных<br />
              домов мира — Chanel, Dior, Tom Ford, Creed
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary"
                style={{ fontSize: 9, letterSpacing: 3 }}
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => setCategory("Подарочные наборы")}
                className="btn-secondary"
                style={{ fontSize: 9, letterSpacing: 3, borderColor: "rgba(201,169,110,0.5)", color: "#F5E6C8" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#1A0A2E"; (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#F5E6C8"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.5)"; }}
              >
                Подарочные наборы
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">20+</div>
                <div className="hero-stat-label">ароматов</div>
              </div>
              <div>
                <div className="hero-stat-num">8</div>
                <div className="hero-stat-label">брендов</div>
              </div>
              <div>
                <div className="hero-stat-num">4</div>
                <div className="hero-stat-label">категории</div>
              </div>
            </div>
          </div>

          {/* Right: decorative */}
          <div className="hero-visual">
            <div className="hero-bottle-ring">
              <div className="hero-bottle-inner">
                <span className="hero-monogram">El</span>
              </div>
              {/* Floating dots */}
              {[0, 72, 144, 216, 288].map((deg, i) => (
                <div key={i} style={{
                  position: "absolute",
                  width: i % 2 === 0 ? 5 : 3,
                  height: i % 2 === 0 ? 5 : 3,
                  background: "#C9A96E",
                  borderRadius: "50%",
                  top: `${50 - 50 * Math.cos(deg * Math.PI / 180)}%`,
                  left: `${50 + 50 * Math.sin(deg * Math.PI / 180)}%`,
                  opacity: 0.6,
                  transform: "translate(-50%, -50%)",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATALOG SECTION ═══ */}
      <section id="catalog" style={{ padding: "0 0 80px" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", padding: "60px 24px 0" }}>
          <p className="section-eyebrow" style={{ marginBottom: 12 }}>Notre Collection</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Коллекция ароматов</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "16px 0 0" }}>
            <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #C9A96E)" }} />
            <div style={{ width: 5, height: 5, background: "#C9A96E", borderRadius: "50%" }} />
            <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
          </div>
        </div>

        {/* Category pills */}
        <div className="category-filters" style={{ padding: "32px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill${activeCategory === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || category || minPrice || maxPrice) && (
          <div style={{ textAlign: "center", padding: "16px 0 0" }}>
            <p style={{ fontSize: 10, color: "#8A7F75", fontFamily: "Montserrat", letterSpacing: 2 }}>
              Найдено: <strong style={{ color: "#1A0A2E" }}>{filtered.length}</strong> ароматов
            </p>
          </div>
        )}

        {/* Product grid */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product, idx) => (
                <ProductCard key={product.id} product={product} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="animate-fadeIn" style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{
                width: 80, height: 80, border: "1px solid #E8DDD0",
                margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className="fas fa-search" style={{ fontSize: 28, color: "#C9A96E" }} />
              </div>
              <h3 className="serif" style={{ fontSize: 28, color: "#1A0A2E", fontWeight: 400, marginBottom: 10 }}>
                {search || category || minPrice || maxPrice ? "Ароматы не найдены" : "Каталог пуст"}
              </h3>
              <p style={{ fontSize: 10, letterSpacing: 2.5, color: "#8A7F75", fontFamily: "Montserrat", textTransform: "uppercase" }}>
                {search || category || minPrice || maxPrice ? "Попробуйте изменить фильтры" : "Товары появятся здесь"}
              </p>
              {(search || category || minPrice || maxPrice) && (
                <button
                  onClick={() => setSearchParams({})}
                  className="btn-secondary"
                  style={{ marginTop: 24, fontSize: 9 }}
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══ BRANDS STRIP ═══ */}
      {filtered.length > 0 && (
        <section style={{ borderTop: "1px solid #E8DDD0", borderBottom: "1px solid #E8DDD0", background: "#FFFFFF", padding: "24px 48px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 40 }}>
            <span style={{ fontSize: 7, letterSpacing: 4, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, flexShrink: 0 }}>Наши бренды</span>
            {["Chanel", "Dior", "Tom Ford", "Creed", "Byredo", "Maison Margiela", "Giorgio Armani", "Calvin Klein"].map(brand => (
              <span key={brand} style={{
                fontSize: 11, letterSpacing: 2, color: "#8A7F75",
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 500,
                cursor: "pointer", transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#1A0A2E"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#8A7F75"}
                onClick={() => {
                  const next = new URLSearchParams();
                  next.set("search", brand);
                  setSearchParams(next);
                  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ product, idx }: { product: any; idx: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-stagger"
      style={{ animationDelay: `${(idx % 8) * 0.07}s`, display: "flex", flexDirection: "column", background: "#FFFFFF" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", paddingBottom: "115%", background: "#F5F0EB" }}>
          <img
            src={product.image || "https://placehold.co/400x460/1A0A2E/C9A96E?text=ELIXIR"}
            alt={product.name}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />

          {/* Category badge */}
          {product.category && (
            <div style={{
              position: "absolute", top: 0, left: 0,
              background: "#1A0A2E", color: "#C9A96E",
              padding: "5px 12px", fontSize: 7.5, letterSpacing: 3,
              textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600,
            }}>
              {product.category}
            </div>
          )}

          {/* Low stock */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              background: "rgba(232,160,32,0.9)", color: "#fff",
              padding: "4px 10px", fontSize: 7.5, letterSpacing: 2,
              textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600,
            }}>
              Осталось {product.stock}
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(26,10,46,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#F5E6C8", fontFamily: "Montserrat", fontWeight: 600 }}>
                Нет в наличии
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(26,10,46,0.4) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s",
          }} />
        </div>

        {/* Info */}
        <div style={{ padding: "20px 20px 14px", flex: 1 }}>
          {product.brand && (
            <p style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 6 }}>
              {product.brand}
            </p>
          )}
          <h3 className="serif" style={{ fontSize: 16, color: "#1A1A1A", marginBottom: 8, fontWeight: 500, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{ fontSize: 10, color: "#8A7F75", lineHeight: 1.7, marginBottom: 14, fontFamily: "Montserrat", fontWeight: 300 }}>
            {product.description?.slice(0, 65)}{product.description?.length > 65 ? "..." : ""}
          </p>
          <p className="serif" style={{ fontSize: 20, color: "#1A0A2E", fontWeight: 500 }}>
            {product.price.toLocaleString()} сом.
          </p>
        </div>

        {/* Button area */}
        <div style={{
          padding: "0 20px 20px",
          borderTop: hovered ? "1px solid #E8DDD0" : "1px solid transparent",
          transition: "border-color 0.3s",
        }}>
          <div className="btn-primary" style={{ width: "100%", textAlign: "center", fontSize: 9, letterSpacing: 3, marginTop: 12 }}>
            Подробнее
          </div>
        </div>
      </Link>
    </div>
  );
}
