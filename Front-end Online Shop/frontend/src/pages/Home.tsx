import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingLogo from "../components/LoadingLogo";
import { cacheGet, cacheSet } from "../utils/cache";

const PRODUCTS_CACHE = "products";
const CATEGORIES = ["Все", "Мужские", "Женские", "Унисекс", "Подарочные наборы"];
const BRANDS = ["Chanel", "Dior", "Tom Ford", "Creed", "Byredo", "Maison Margiela", "Giorgio Armani", "Calvin Klein"];

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
    if (cat === "Все") next.delete("category"); else next.set("category", cat);
    setSearchParams(next);
  };

  const activeCategory = category || "Все";

  if (loading) return <LoadingLogo height="100vh" />;

  return (
    <div style={{ background: "#F5F0E8" }}>

      {/* ═══════════════════════════════════════
          HERO — NOIR LUXE
      ════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-ambient">
          <div className="hero-ambient-1" />
          <div className="hero-ambient-2" />
          <div className="hero-ambient-3" />
          {/* Subtle grid pattern */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: "linear-gradient(rgba(196,154,80,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,154,80,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="hero-grid">
          {/* Text */}
          <div>
            <div className="hero-eyebrow animate-fadeInDelay1">
              L'Art du Parfum
            </div>

            <h1 className="hero-heading animate-fadeInDelay1">
              Искусство<br />
              <em>аромата</em>
            </h1>

            <p className="hero-desc animate-fadeInDelay2">
              Премиальная парфюмерия от легендарных домов мира.
              Каждый флакон — это история, созданная для вас.
            </p>

            <div className="hero-cta animate-fadeInDelay2">
              <button
                onClick={() => { document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  fontFamily: "'Jost', sans-serif", fontSize: 9.5, fontWeight: 500,
                  letterSpacing: 4, textTransform: "uppercase",
                  padding: "15px 40px",
                  background: "linear-gradient(135deg, #8A6A2C 0%, #C49A50 50%, #E8CE90 100%)",
                  border: "none",
                  color: "#080810", cursor: "pointer",
                  transition: "all 0.35s",
                  boxShadow: "0 8px 40px rgba(196,154,80,0.25)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 60px rgba(196,154,80,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(196,154,80,0.25)"; }}
              >
                <i className="fas fa-chevron-down" style={{ fontSize: 8 }} />
                Смотреть каталог
              </button>

              <button
                onClick={() => setCategory("Подарочные наборы")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  fontFamily: "'Jost', sans-serif", fontSize: 9.5, fontWeight: 400,
                  letterSpacing: 3.5, textTransform: "uppercase",
                  padding: "14px 32px",
                  background: "transparent",
                  border: "1px solid rgba(196,154,80,0.4)",
                  color: "rgba(234,226,214,0.75)", cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C49A50"; (e.currentTarget as HTMLElement).style.color = "#E8CE90"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,154,80,0.4)"; (e.currentTarget as HTMLElement).style.color = "rgba(234,226,214,0.75)"; }}
              >
                <i className="fas fa-gift" style={{ fontSize: 9, color: "rgba(196,154,80,0.7)" }} />
                Подарочные наборы
              </button>
            </div>

            {/* Divider */}
            <div className="animate-fadeInDelay3" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, maxWidth: 500 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(196,154,80,0.4), rgba(196,154,80,0.1))" }} />
            </div>

            {/* Stats */}
            <div className="hero-stats animate-fadeInDelay3">
              {[
                { value: "20+", label: "Ароматов" },
                { value: "8", label: "Брендов" },
                { value: "4", label: "Категории" },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div className="hero-visual animate-fadeInDelay2">
            <div className="hero-panel">
              {/* Corner marks */}
              <div className="hero-corner hero-corner-tl" />
              <div className="hero-corner hero-corner-tr" />
              <div className="hero-corner hero-corner-bl" />
              <div className="hero-corner hero-corner-br" />

              {/* Orbit ring */}
              <div className="hero-orbit" style={{ width: "60%", height: "60%", top: "20%", left: "20%" }}>
                <div className="hero-orbit-dot" />
              </div>
              <div className="hero-orbit" style={{ width: "80%", height: "80%", top: "10%", left: "10%", animationDirection: "reverse", animationDuration: "45s" }} />

              <div className="hero-panel-inner">
                <div className="hero-monogram">El</div>
                <div className="hero-panel-label">Maison de Parfum</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{
                      width: i === 1 ? 6 : 4, height: i === 1 ? 6 : 4,
                      borderRadius: "50%",
                      background: `rgba(196,154,80,${0.2 + i * 0.1})`,
                    }} />
                  ))}
                </div>
              </div>

              {/* Category labels on sides */}
              {["Мужские", "Женские", "Унисекс"].map((cat, i) => (
                <div key={cat} style={{
                  position: "absolute",
                  left: -1, top: `${25 + i * 20}%`,
                  background: "rgba(8,8,16,0.8)",
                  border: "1px solid rgba(196,154,80,0.2)",
                  borderLeft: "2px solid rgba(196,154,80,0.6)",
                  padding: "5px 12px",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 7.5, letterSpacing: 2.5,
                  textTransform: "uppercase",
                  color: "rgba(196,154,80,0.7)",
                  transform: "translateX(-100%)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                  onClick={() => setCategory(cat)}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#E8CE90"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(196,154,80,0.7)"}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "float 3s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 7.5, letterSpacing: 4, textTransform: "uppercase", color: "rgba(196,154,80,0.4)", fontFamily: "'Jost'" }}>scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(180deg, rgba(196,154,80,0.4), transparent)" }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BRANDS STRIP
      ════════════════════════════════════════ */}
      <div className="brands-strip">
        <div className="brands-track">
          <span style={{ fontFamily: "'Jost'", fontSize: 7.5, letterSpacing: 5, textTransform: "uppercase", color: "#C49A50", fontWeight: 500, flexShrink: 0 }}>Бренды</span>
          {BRANDS.map(brand => (
            <span key={brand} className="brand-item"
              onClick={() => { const next = new URLSearchParams(); next.set("search", brand); setSearchParams(next); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
            >{brand}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CATALOG
      ════════════════════════════════════════ */}
      <section id="catalog" className="catalog-section">

        {/* Header */}
        <div className="catalog-header">
          <p className="section-eyebrow">Notre Collection</p>
          <h2 className="catalog-title">Коллекция ароматов</h2>
          <div className="ornament" style={{ justifyContent: "center" }}>
            <div className="ornament-dot" />
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
            <div className="ornament-dot" />
          </div>
        </div>

        {/* Category pills */}
        <div className="cat-filters">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-btn${activeCategory === cat ? " active" : ""}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || category || minPrice || maxPrice) && (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 10, color: "#9A9080", fontFamily: "'Jost'", letterSpacing: 2 }}>
              Найдено: <strong style={{ color: "#1A1410" }}>{filtered.length}</strong> ароматов
            </p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} idx={i} />)}
          </div>
        ) : (
          <div className="animate-fadeIn" style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{
              width: 72, height: 72, border: "1px solid #DDD0BE",
              margin: "0 auto 28px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fas fa-search" style={{ fontSize: 24, color: "#C49A50" }} />
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#1A1410", fontWeight: 300, marginBottom: 12, letterSpacing: 2 }}>
              {search || category || minPrice || maxPrice ? "Ничего не найдено" : "Каталог пуст"}
            </h3>
            <p style={{ fontSize: 9.5, letterSpacing: 3, color: "#9A9080", fontFamily: "'Jost'", textTransform: "uppercase" }}>
              {search || category || minPrice || maxPrice ? "Попробуйте другие фильтры" : "Товары появятся здесь"}
            </p>
            {(search || category || minPrice || maxPrice) && (
              <button onClick={() => setSearchParams({})} style={{
                marginTop: 28, padding: "12px 32px",
                border: "1px solid #DDD0BE", background: "transparent",
                fontFamily: "'Jost'", fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                color: "#5A5048", cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C49A50"; (e.currentTarget as HTMLElement).style.color = "#C49A50"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#DDD0BE"; (e.currentTarget as HTMLElement).style.color = "#5A5048"; }}
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          FOOTER BANNER
      ════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(135deg, #0F0E1A 0%, #080810 40%, #12101C 100%)",
        padding: "72px 40px",
        textAlign: "center",
        borderTop: "1px solid rgba(196,154,80,0.1)",
      }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 8.5, letterSpacing: 6, color: "rgba(196,154,80,0.5)", marginBottom: 18, fontWeight: 400 }}>
          ELIXIR — MAISON DE PARFUM
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, color: "#EAE2D6", letterSpacing: 3, marginBottom: 20, lineHeight: 1.2 }}>
          Найдите свой <em style={{ fontStyle: "italic", color: "#D4AE6A" }}>неповторимый</em> аромат
        </h2>
        <p style={{ fontSize: 12, color: "rgba(234,226,214,0.45)", fontFamily: "'Jost'", letterSpacing: 1.5, fontWeight: 300, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          Более 20 ароматов от 8 легендарных парфюмерных домов — в одном месте
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            padding: "14px 48px",
            background: "linear-gradient(135deg, #8A6A2C, #C49A50, #E8CE90)",
            border: "none", color: "#080810",
            fontFamily: "'Jost'", fontSize: 9.5, letterSpacing: 4,
            textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 8px 40px rgba(196,154,80,0.2)",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 60px rgba(196,154,80,0.4)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(196,154,80,0.2)"}
        >
          К каталогу
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, idx }: { product: any; idx: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="product-card card-stagger"
        style={{ animationDelay: `${(idx % 12) * 0.06}s` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="product-card-img-wrap">
          <img
            className="product-card-img"
            src={product.image || "https://placehold.co/400x480/0A0912/C49A50?text=ELIXIR"}
            alt={product.name}
          />

          {/* Dark overlay with view button */}
          <div className="product-card-overlay">
            <span className="product-card-view-btn">Смотреть</span>
          </div>

          {/* Category badge */}
          {product.category && (
            <div className="product-card-category">{product.category}</div>
          )}

          {/* Stock badge */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <div className="product-card-stock-badge" style={{ background: "rgba(208,144,64,0.9)", color: "#fff" }}>
              Осталось {product.stock}
            </div>
          )}
          {product.stock === 0 && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(8,8,16,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: 3.5, textTransform: "uppercase", color: "rgba(234,226,214,0.7)", border: "1px solid rgba(234,226,214,0.2)", padding: "8px 18px" }}>
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="product-card-body">
          {product.brand && <p className="product-card-brand">{product.brand}</p>}
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-desc">
            {product.description?.slice(0, 60)}{product.description?.length > 60 ? "..." : ""}
          </p>
          <div className="product-card-footer">
            <div>
              <span className="product-card-price">{product.price.toLocaleString()}</span>
              <span className="product-card-price-suffix"> сом.</span>
            </div>
            <div style={{
              width: 32, height: 32,
              border: `1px solid ${hovered ? "#C49A50" : "#DDD0BE"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
              background: hovered ? "#080810" : "transparent",
              flexShrink: 0,
            }}>
              <i className="fas fa-arrow-right" style={{ fontSize: 10, color: hovered ? "#C49A50" : "#9A9080", transition: "color 0.3s" }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
