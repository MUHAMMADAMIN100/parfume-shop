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

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct]       = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage]   = useState<string>("");
  const [imgFading, setImgFading]       = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [touchStartX, setTouchStartX]   = useState<number | null>(null);

  const dispatch  = useDispatch<AppDispatch>();
  const token     = useSelector((state: RootState) => state.auth.token);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    window.scrollTo(0, 0);
    const key = `product-${id}`;
    const cached = cacheGet<Product>(key);
    if (cached) { setProduct(cached); setActiveImage(cached.image || ""); }
    axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(res => {
        const p: Product = res.data;
        cacheSet(key, p);
        setProduct(p);
        if (!cached) setActiveImage(p.image || "");
      })
      .catch(console.error);
  }, [id]);

  const switchImage = (url: string) => {
    if (url === activeImage) return;
    setImgFading(true);
    setTimeout(() => { setActiveImage(url); setImgFading(false); }, 160);
  };

  const handleAdd = async () => {
    if (!token) { notify.warning("Войдите в аккаунт", "Для добавления товара необходима авторизация"); return; }
    if (product?.sizes?.length && !selectedSize) { notify.warning("Выберите объём", "Пожалуйста, выберите объём перед добавлением"); return; }
    const alreadyInCart = cartItems.some(i => i.productId === product!.id && (i.size ?? null) === (selectedSize ?? null));
    if (alreadyInCart) { notify.warning("Уже в корзине", "Этот аромат с выбранным объёмом уже в корзине"); return; }

    const tempId = -(product!.id * 1000 + Date.now() % 1000);
    dispatch(optimisticAdd({ id: tempId, productId: product!.id, quantity: 1, size: selectedSize ?? undefined, product: { id: product!.id, name: product!.name, description: product!.description || '', price: product!.price, image: product!.image } }));
    notify.addedToCart();
    setAddingToCart(true);
    dispatch(addToCart({ productId: product!.id, quantity: 1, size: selectedSize ?? undefined }))
      .catch(() => { dispatch(optimisticRemove(tempId)); notify.error("Ошибка", "Не удалось добавить товар"); })
      .finally(() => setTimeout(() => setAddingToCart(false), 400));
  };

  const gallery: string[] = product?.image ? [product.image] : [];

  const stockInfo = () => {
    if (!product) return null;
    const s = product.stock ?? 0;
    if (s === 0)  return { label: "Нет в наличии",     color: "#C06050" };
    if (s <= 3)   return { label: `Осталось ${s} шт`,  color: "#D4903A" };
    if (s <= 10)  return { label: `${s} шт в наличии`, color: "#5A9A60" };
    return          { label: "В наличии",              color: "#5A9A60" };
  };

  if (!product) return <LoadingLogo height="100vh" />;
  const stock = stockInfo();

  return (
    <div style={{ background: "#F5F0E8", minHeight: "100vh" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "#080810", borderBottom: "1px solid rgba(196,154,80,0.1)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link to="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 2.5,
            textTransform: "uppercase", color: "rgba(196,154,80,0.6)",
            textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C49A50"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(196,154,80,0.6)"}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: 8 }} />
            Каталог
          </Link>
          {product.category && <>
            <span style={{ color: "rgba(196,154,80,0.2)", fontSize: 10 }}>/</span>
            <span style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(196,154,80,0.4)" }}>{product.category}</span>
          </>}
          {product.brand && <>
            <span style={{ color: "rgba(196,154,80,0.2)", fontSize: 10 }}>/</span>
            <span style={{ fontFamily: "'Jost'", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(196,154,80,0.4)" }}>{product.brand}</span>
          </>}
        </div>
      </div>

      {/* ── Product Layout ── */}
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div className="product-page-grid" style={{ background: "#FFFFFF" }}>

          {/* ═══ LEFT: Gallery ═══ */}
          <div style={{ position: "relative", background: "#F0EBE3" }}>
            <div style={{ display: "flex", height: "100%", minHeight: 580 }}>

              {/* Vertical thumbs */}
              {gallery.length > 1 && (
                <div className="product-gallery-sidebar" style={{ flexDirection: "column", gap: 8, padding: "20px 0 20px 20px", flexShrink: 0 }}>
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => switchImage(img)} style={{
                      width: 64, height: 64, padding: 0, border: "none",
                      outline: activeImage === img ? "2px solid #C49A50" : "2px solid transparent",
                      cursor: "pointer", background: "#EDE5D8", overflow: "hidden",
                      transition: "outline 0.2s", flexShrink: 0,
                    }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                style={{ flex: 1, position: "relative", overflow: "hidden" }}
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
                {/* Category badge */}
                {product.category && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, zIndex: 2,
                    background: "#080810", color: "#C49A50",
                    padding: "7px 16px", fontFamily: "'Jost'",
                    fontSize: 8, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500,
                  }}>{product.category}</div>
                )}

                <img
                  src={activeImage || "https://placehold.co/600x600/0A0912/C49A50?text=ELIXIR"}
                  alt={product.name}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    opacity: imgFading ? 0 : 1,
                    transform: imgFading ? "scale(1.02)" : "scale(1)",
                    transition: "opacity 0.16s, transform 0.16s",
                  }}
                />
              </div>
            </div>

            {/* Mobile dots */}
            {gallery.length > 1 && (
              <div className="mobile-gallery-dots">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => switchImage(img)} style={{
                    width: activeImage === img ? 20 : 7, height: 7,
                    background: activeImage === img ? "#C49A50" : "#DDD0BE",
                    border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Details ═══ */}
          <div style={{
            padding: "clamp(32px, 5vw, 64px)",
            display: "flex", flexDirection: "column",
            borderLeft: "1px solid #EDE5D8",
          }}>

            {/* Brand */}
            <div className="animate-fadeInDelay1" style={{ marginBottom: 20 }}>
              {product.brand && (
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10, letterSpacing: 4.5, textTransform: "uppercase",
                  color: "#C49A50", fontWeight: 500, marginBottom: 6,
                }}>{product.brand}</p>
              )}
              {product.category && (
                <p style={{ fontFamily: "'Jost'", fontSize: 8.5, letterSpacing: 3, textTransform: "uppercase", color: "#9A9080" }}>
                  {product.category}
                </p>
              )}
            </div>

            {/* Name */}
            <h1 className="animate-fadeInDelay1" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 300, color: "#1A1410",
              lineHeight: 1.15, letterSpacing: 1.5,
              marginBottom: 24,
            }}>
              {product.name}
            </h1>

            {/* Gold ornament */}
            <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, #C49A50, rgba(196,154,80,0.2))" }} />
              <div style={{ width: 5, height: 5, background: "#C49A50", transform: "rotate(45deg)", flexShrink: 0 }} />
            </div>

            {/* Price */}
            <div className="animate-fadeInDelay2" style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: "#1A1410", letterSpacing: 1 }}>
                {product.price.toLocaleString()}
              </span>
              <span style={{ fontFamily: "'Jost'", fontSize: 12, fontWeight: 300, color: "#9A9080", letterSpacing: 2, marginLeft: 6 }}>
                сом.
              </span>
            </div>

            {/* Stock */}
            {stock && (
              <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                <div className="stock-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: stock.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost'", fontSize: 9.5, letterSpacing: 2, color: stock.color, fontWeight: 500, textTransform: "uppercase" }}>
                  {stock.label}
                </span>
              </div>
            )}

            {/* Volume selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="animate-fadeInDelay3" style={{ marginBottom: 28 }}>
                <p style={{ fontFamily: "'Jost'", fontSize: 8.5, letterSpacing: 3.5, textTransform: "uppercase", color: "#9A9080", fontWeight: 500, marginBottom: 14 }}>
                  Объём — <span style={{ color: selectedSize ? "#1A1410" : "#C49A50", letterSpacing: 1 }}>{selectedSize || "не выбран"}</span>
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{
                      minWidth: 56, height: 44, padding: "0 12px",
                      border: selectedSize === s ? "1px solid #080810" : "1px solid #DDD0BE",
                      background: selectedSize === s ? "#080810" : "transparent",
                      color: selectedSize === s ? "#C49A50" : "#5A5048",
                      fontFamily: "'Jost'", fontSize: 11, fontWeight: selectedSize === s ? 500 : 300,
                      cursor: "pointer", transition: "all 0.25s", letterSpacing: 0.5,
                    }}
                      onMouseEnter={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = "#C49A50"; (e.currentTarget as HTMLElement).style.color = "#C49A50"; } }}
                      onMouseLeave={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = "#DDD0BE"; (e.currentTarget as HTMLElement).style.color = "#5A5048"; } }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="animate-fadeInDelay3" style={{ marginBottom: 32 }}>
                <div style={{
                  padding: "20px 22px",
                  background: "#F5F0E8",
                  borderLeft: "2px solid #C49A50",
                }}>
                  <p style={{ fontFamily: "'Jost'", fontSize: 12, fontWeight: 300, color: "#5A5048", lineHeight: 2, letterSpacing: 0.3 }}>
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={addingToCart || product.stock === 0}
              className={addingToCart ? "btn-loading" : ""}
              style={{
                width: "100%", padding: "18px 32px",
                background: product.stock === 0
                  ? "rgba(8,8,16,0.3)"
                  : "linear-gradient(135deg, #6A4A1C 0%, #C49A50 50%, #E8CE90 100%)",
                border: "none", color: product.stock === 0 ? "#6A6060" : "#080810",
                fontFamily: "'Jost'", fontSize: 9.5, fontWeight: 500,
                letterSpacing: 4, textTransform: "uppercase",
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                transition: "all 0.35s",
                marginBottom: 24,
                boxShadow: product.stock === 0 ? "none" : "0 8px 32px rgba(196,154,80,0.2)",
              }}
              onMouseEnter={e => { if (product.stock !== 0 && !addingToCart) (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(196,154,80,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = product.stock === 0 ? "none" : "0 8px 32px rgba(196,154,80,0.2)"; }}
            >
              {addingToCart ? "Добавляем..." : product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
            </button>

            {/* Perks */}
            <div className="animate-fadeInDelay4" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 20, borderTop: "1px solid #EDE5D8" }}>
              {[
                { icon: "fa-shield-alt", text: "Гарантия подлинности всех ароматов" },
                { icon: "fa-truck", text: "Бесплатная доставка от 5 000 сом." },
                { icon: "fa-undo-alt", text: "Возврат в течение 14 дней" },
                { icon: "fa-gift", text: "Фирменная упаковка в подарок" },
              ].map(item => (
                <div key={item.icon} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 32, height: 32, border: "1px solid #EDE5D8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`fas ${item.icon}`} style={{ fontSize: 10, color: "#C49A50" }} />
                  </div>
                  <span style={{ fontFamily: "'Jost'", fontSize: 11, fontWeight: 300, color: "#7A7060", letterSpacing: 0.3 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
