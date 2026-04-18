import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../utils/swal";
import type { AppDispatch, RootState } from "../app/store";
import { addToCart, optimisticAdd, optimisticRemove } from "../features/cart/cartSlice";
import LoadingLogo from "../components/LoadingLogo";
import { cacheGet, cacheSet } from "../utils/cache";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
  sizes?: string[];
  stock?: number;
}

const IMG_H = 520;


export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct]         = useState<Product | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [activeImage, setActiveImage]     = useState<string>("");
  const [imgFading, setImgFading]         = useState(false);
  const [addingToCart, setAddingToCart]   = useState(false);
  const [touchStartX, setTouchStartX]     = useState<number | null>(null);

  const dispatch   = useDispatch<AppDispatch>();
  const token      = useSelector((state: RootState) => state.auth.token);
  const cartItems  = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    window.scrollTo(0, 0);
    const cacheKey = `product-${id}`;
    const cached = cacheGet<Product>(cacheKey);
    if (cached) {
      setProduct(cached);
      setActiveImage(cached.image || "");
      setSelectedSize(null);
    }
    axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(res => {
        const p: Product = res.data;
        cacheSet(cacheKey, p);
        setProduct(p);
        if (!cached) {
          setActiveImage(p.image || "");
          setSelectedSize(null);
        }
      })
      .catch(console.error);
  }, [id]);

  /** Плавная смена картинки */
  const switchImage = (url: string) => {
    if (url === activeImage) return;
    setImgFading(true);
    setTimeout(() => { setActiveImage(url); setImgFading(false); }, 180);
  };

  const handleAdd = async () => {
    if (!token) {
      notify.warning("Войдите в аккаунт", "Для добавления товара необходима авторизация");
      return;
    }
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      notify.warning("Выберите объём", "Пожалуйста, выберите объём перед добавлением");
      return;
    }

    const alreadyInCart = cartItems.some(
      item => item.productId === product!.id
        && (item.size ?? null) === (selectedSize ?? null)
    );
    if (alreadyInCart) {
      notify.warning("Уже в корзине", "Этот аромат с выбранным объёмом уже в корзине");
      return;
    }

    const tempId = -(product!.id * 1000 + Date.now() % 1000);
    dispatch(optimisticAdd({
      id: tempId,
      productId: product!.id,
      quantity: 1,
      size: selectedSize ?? undefined,
      product: { id: product!.id, name: product!.name, description: product!.description || '', price: product!.price, image: product!.image }
    }));
    notify.addedToCart();
    setAddingToCart(true);

    dispatch(addToCart({ productId: product!.id, quantity: 1, size: selectedSize ?? undefined }))
      .catch(() => {
        dispatch(optimisticRemove(tempId));
        notify.error("Ошибка", "Не удалось добавить товар");
      })
      .finally(() => setTimeout(() => setAddingToCart(false), 400));
  };

  const gallery: string[] = product?.image ? [product.image] : [];

  const stockInfo = () => {
    if (!product) return null;
    const s = product.stock ?? 0;
    if (s === 0)   return { label: "Нет в наличии",       color: "#FF0000" };
    if (s <= 3)    return { label: `Осталось ${s} шт`,    color: "#CC8800" };
    if (s <= 10)   return { label: `${s} шт в наличии`,   color: "#008000" };
    return           { label: "В наличии",                color: "#008000" };
  };

  if (!product) return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: 16 }}>
      <div className="loader-ring" />
      <LoadingLogo height="60vh" />
    </div>
  );

  const stock = stockInfo();

  return (
    <div className="page-wrapper">
      {/* ← Главное меню */}
      <Link to="/" className="back-btn">
        <i className="fas fa-arrow-left" style={{ fontSize: 12 }} />
        Главное меню
      </Link>
      <div className="animate-slideInUp" style={{ maxWidth: 1100, margin: "0 auto", backgroundColor: "#FFFFFF", border: "1px solid #D9CFC0", display: "flex", flexWrap: "wrap" }}>

        {/* ═══ ЛЕВАЯ ЧАСТЬ: галерея ═══ */}
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column" }}>

          <div style={{ display: "flex", flex: 1 }}>
            {/* Тумбы (вертикальные, только на десктопе) */}
            {gallery.length > 1 && (
              <div className="product-gallery-sidebar" style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0 16px 16px", flexShrink: 0 }}>
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => switchImage(img)} style={{
                    width: 72, height: 72, padding: 0,
                    border: activeImage === img ? "2px solid #FF0000" : "1px solid #D9CFC0",
                    cursor: "pointer", background: "#FAFAFA", overflow: "hidden",
                    transform: activeImage === img ? "scale(1.05)" : "scale(1)",
                    transition: "all 0.22s", flexShrink: 0
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Главное фото + свайп на мобиле */}
            <div
              style={{ flex: 1, position: "relative", height: IMG_H, overflow: "hidden", cursor: gallery.length > 1 ? "grab" : "default" }}
              onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={e => {
                if (touchStartX === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(dx) > 40) {
                  const idx = gallery.indexOf(activeImage);
                  if (dx < 0 && idx < gallery.length - 1) switchImage(gallery[idx + 1]);
                  else if (dx > 0 && idx > 0) switchImage(gallery[idx - 1]);
                }
                setTouchStartX(null);
              }}
            >
              {product.category && (
                <div style={{ position: "absolute", top: 16, left: 0, zIndex: 2, backgroundColor: "#1A0A2E", color: "#C9A96E", padding: "5px 16px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600 }}>
                  {product.category}
                </div>
              )}
              <img
                src={activeImage || "https://placehold.co/600x520/1A0A2E/C9A96E?text=ELIXIR"}
                alt={product.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: imgFading ? 0 : 1, transform: imgFading ? "scale(1.02)" : "scale(1)", transition: "opacity 0.18s ease, transform 0.18s ease" }}
              />
            </div>
          </div>

          {/* Точки-навигатор (только мобиль) */}
          {gallery.length > 1 && (
            <div className="mobile-gallery-dots">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => switchImage(img)} style={{ width: activeImage === img ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: activeImage === img ? "#FF0000" : "#D9CFC0", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />
              ))}
            </div>
          )}
        </div>

        {/* ═══ ПРАВАЯ ЧАСТЬ: детали ═══ */}
        <div style={{ flex: "1 1 300px", minWidth: 0, padding: "clamp(20px, 4vw, 44px)", display: "flex", flexDirection: "column" }}>

          {product.category && (
            <p className="animate-fadeInDelay1" style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 10 }}>
              {product.category}
            </p>
          )}

          {product.brand && (
            <p className="animate-fadeInDelay1" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#1A0A2E", fontFamily: "Montserrat", fontWeight: 700, marginBottom: 6 }}>
              {product.brand}
            </p>
          )}

          <h1 className="serif animate-fadeInDelay1" style={{ fontSize: 30, color: "#1A1A1A", fontWeight: 500, marginBottom: 16, lineHeight: 1.3 }}>
            {product.name}
          </h1>

          <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, backgroundColor: "#C9A96E" }} />
            <div style={{ width: 5, height: 5, backgroundColor: "#1A0A2E", borderRadius: "50%" }} />
            <div style={{ width: 28, height: 1, backgroundColor: "#C9A96E" }} />
          </div>

          <p className="serif animate-fadeInDelay2" style={{ fontSize: 36, color: "#1A0A2E", fontWeight: 600, marginBottom: 14 }}>
            {product.price.toLocaleString()} сом.
          </p>

          {/* Статус наличия */}
          {stock && (
            <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div className="stock-pulse" style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: stock.color }} />
              <span style={{ fontSize: 11, fontFamily: "Montserrat", letterSpacing: 1, color: stock.color, fontWeight: 600 }}>
                {stock.label}
              </span>
            </div>
          )}

          {/* ── Объём ── */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="animate-fadeInDelay3" style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#777", fontFamily: "Montserrat", marginBottom: 10 }}>
                Объём: <strong style={{ color: "#1A1A1A", letterSpacing: 0 }}>{selectedSize || "—"}</strong>
              </p>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      minWidth: 46, height: 44, padding: "0 10px",
                      border: selectedSize === s ? "2px solid #1A1A1A" : "1px solid #D9CFC0",
                      backgroundColor: selectedSize === s ? "#1A1A1A" : "#fff",
                      color: selectedSize === s ? "#fff" : "#1A1A1A",
                      fontFamily: "Montserrat", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                      transform: selectedSize === s ? "scale(1.08)" : "scale(1)"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Описание ── */}
          {product.description && (
            <p className="animate-fadeInDelay3" style={{
              fontSize: 13, color: "#666", lineHeight: 1.85,
              fontFamily: "Montserrat", marginBottom: 28,
              borderLeft: "3px solid #F0ECE4", paddingLeft: 14
            }}>
              {product.description}
            </p>
          )}

          {/* ── Кнопка ── */}
          <button
            onClick={handleAdd}
            disabled={addingToCart || product.stock === 0}
            className={`btn-primary animate-fadeInDelay4${addingToCart ? " btn-loading" : ""}`}
            style={{ width: "100%", textAlign: "center", fontSize: 11, opacity: product.stock === 0 ? 0.5 : 1 }}
          >
            {addingToCart ? "Добавляем..." : product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
          </button>

        </div>
      </div>
    </div>
  );
}
