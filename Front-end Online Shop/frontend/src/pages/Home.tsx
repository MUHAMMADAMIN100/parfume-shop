import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingLogo from "../components/LoadingLogo";
import { cacheGet, cacheSet } from "../utils/cache";

const PRODUCTS_CACHE = "products";

export default function Home() {
  const [products, setProducts] = useState<any[]>(() => cacheGet<any[]>(PRODUCTS_CACHE) ?? []);
  const [loading, setLoading] = useState(() => !cacheGet(PRODUCTS_CACHE));
  const [searchParams] = useSearchParams();

  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    // Всегда обновляем в фоне — если кэш есть, загрузка уже false
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => { setProducts(res.data); cacheSet(PRODUCTS_CACHE, res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  if (loading) return <LoadingLogo height="80vh" />;

  return (
    <div className="page-wrapper">

      {/* Заголовок */}
      <div className="animate-slideInUp" style={{ textAlign: "center", marginBottom: 60 }}>
        <p style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 12 }}>
          Новые ароматы
        </p>
        <h1 className="serif" style={{ fontSize: 42, color: "#1A0A2E", letterSpacing: 4, fontWeight: 500, marginBottom: 16 }}>
          Коллекция ароматов
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 }}>
          <div style={{ width: 40, height: 1, backgroundColor: "#C9A96E" }} />
          <div style={{ width: 6, height: 6, backgroundColor: "#1A0A2E", borderRadius: "50%" }} />
          <div style={{ width: 40, height: 1, backgroundColor: "#C9A96E" }} />
        </div>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#888", fontFamily: "Montserrat" }}>
          Премиум парфюмерия
        </p>
        {(search || category || minPrice || maxPrice) && (
          <p style={{ marginTop: 12, fontSize: 11, color: "#888", fontFamily: "Montserrat", letterSpacing: 1 }}>
            Найдено: <strong style={{ color: "#1A1A1A" }}>{filtered.length}</strong> товаров
          </p>
        )}
      </div>

      {/* Сетка товаров */}
      <div className="product-grid">
        {filtered.map(product => (
          <div key={product.id} className="italian-card card-stagger" style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
              {/* Фото */}
              <div className="product-card-img-wrap" style={{ position: "relative", overflow: "hidden", height: 260 }}>
                <img
                  src={product.image || "https://placehold.co/400x300/1A0A2E/C9A96E?text=ELIXIR"}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                />
                {product.category && (
                  <div style={{
                    position: "absolute", top: 12, left: 0,
                    backgroundColor: "#1A0A2E", color: "#C9A96E",
                    padding: "4px 14px", fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600
                  }}>
                    {product.category}
                  </div>
                )}
                {/* Бренд если есть */}
                {product.brand && (
                  <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                    <span style={{ fontSize: 9, color: "#F5E6C8", fontFamily: "Montserrat", letterSpacing: 2, textTransform: "uppercase", backgroundColor: "rgba(26,10,46,0.7)", padding: "3px 8px" }}>
                      {product.brand}
                    </span>
                  </div>
                )}
              </div>

              {/* Инфо */}
              <div style={{ padding: "20px 20px 12px" }}>
                <h3 className="serif" style={{ fontSize: 16, color: "#1A1A1A", marginBottom: 8, fontWeight: 500 }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 12, fontFamily: "Montserrat" }}>
                  {product.description?.slice(0, 70)}{product.description?.length > 70 ? "..." : ""}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p className="serif" style={{ fontSize: 20, color: "#C9A96E", fontWeight: 600 }}>
                    {product.price.toLocaleString()} сом.
                  </p>
                  {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                    <span style={{ fontSize: 9, color: "#CC8800", fontFamily: "Montserrat", letterSpacing: 1 }}>
                      Осталось {product.stock} шт
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span style={{ fontSize: 9, color: "#FF0000", fontFamily: "Montserrat", letterSpacing: 1 }}>
                      Нет в наличии
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Кнопка */}
            <div style={{ padding: "0 20px 20px", marginTop: "auto" }}>
              <Link
                to={`/product/${product.id}`}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", display: "block" }}
              >
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="animate-fadeIn" style={{ textAlign: "center", padding: "80px 0" }}>
          <p className="serif" style={{ fontSize: 24, color: "#1A0A2E", marginBottom: 8 }}>
            {search || category || minPrice || maxPrice ? "Ароматы не найдены" : "Каталог пуст"}
          </p>
          <p style={{ fontSize: 11, letterSpacing: 2, color: "#888", fontFamily: "Montserrat" }}>
            {search || category || minPrice || maxPrice ? "Попробуйте изменить фильтры" : "Товары появятся здесь"}
          </p>
        </div>
      )}
    </div>
  );
}
