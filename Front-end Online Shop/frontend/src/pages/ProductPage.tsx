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

  const switchImage = (url: string) => {
    if (url === activeImage) return;
    setImgFading(true);
    setTimeout(() => { setActiveImage(url); setImgFading(false); }, 160);
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
      item => item.productId === product!.id && (item.size ?? null) === (selectedSize ?? null)
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
    if (s === 0)  return { label: "Нет в наличии",     color: "#C0392B", dot: "#C0392B" };
    if (s <= 3)   return { label: `Осталось ${s} шт`,  color: "#E8A020", dot: "#E8A020" };
    if (s <= 10)  return { label: `${s} шт в наличии`, color: "#2D8A4E", dot: "#2D8A4E" };
    return          { label: "В наличии",              color: "#2D8A4E", dot: "#2D8A4E" };
  };

  if (!product) return <LoadingLogo height="80vh" />;

  const stock = stockInfo();

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>

      {/* Breadcrumb bar */}
      <div style={{ borderBottom: "1px solid #E8DDD0", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/" className="back-btn" style={{ marginBottom: 0, padding: "7px 16px", fontSize: 8 }}>
            <i className="fas fa-arrow-left" />
            Назад в каталог
          </Link>
          {product.category && (
            <>
              <span style={{ color: "#E8DDD0", fontSize: 11 }}>/</span>
              <span style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 600 }}>
                {product.category}
              </span>
            </>
          )}
          {product.brand && (
            <>
              <span style={{ color: "#E8DDD0", fontSize: 11 }}>/</span>
              <span style={{ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: "#8A7F75", fontFamily: "Montserrat" }}>
                {product.brand}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Product layout */}
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="product-page-grid" style={{ background: "#FFFFFF", borderBottom: "1px solid #E8DDD0" }}>

          {/* ═══ LEFT: Gallery ═══ */}
          <div style={{ position: "relative", borderRight: "1px solid #E8DDD0" }}>
            <div style={{ display: "flex", height: "100%", minHeight: 520 }}>

              {/* Vertical thumbs */}
              {gallery.length > 1 && (
                <div className="product-gallery-sidebar" style={{ flexDirection: "column", gap: 8, padding: "20px 0 20px 20px", flexShrink: 0 }}>
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => switchImage(img)} style={{
                      width: 68, height: 68, padding: 0,
                      border: activeImage === img ? "2px solid #1A0A2E" : "1px solid #E8DDD0",
                      cursor: "pointer", background: "#FAF7F2", overflow: "hidden",
                      transition: "all 0.22s", flexShrink: 0,
                    }}>
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                style={{ flex: 1, position: "relative", overflow: "hidden", cursor: "default", background: "#F5F0EB" }}
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
                  <div style={{
                    position: "absolute", top: 0, left: 0, zIndex: 2,
                    background: "#1A0A2E", color: "#C9A96E",
                    padding: "6px 16px", fontSize: 7.5, letterSpacing: 3.5,
                    textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600,
                  }}>
                    {product.category}
                  </div>
                )}
                <img
                  src={activeImage || "https://placehold.co/600x600/1A0A2E/C9A96E?text=ELIXIR"}
                  alt={product.name}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    opacity: imgFading ? 0 : 1,
                    transform: imgFading ? "scale(1.02)" : "scale(1)",
                    transition: "opacity 0.16s ease, transform 0.16s ease",
                  }}
                />
              </div>
            </div>

            {/* Mobile dots */}
            {gallery.length > 1 && (
              <div className="mobile-gallery-dots">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => switchImage(img)} style={{
                    width: activeImage === img ? 18 : 7, height: 7, borderRadius: 4,
                    backgroundColor: activeImage === img ? "#1A0A2E" : "#E8DDD0",
                    border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Details ═══ */}
          <div style={{ padding: "clamp(28px, 5vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            {/* Brand & category */}
            <div className="animate-fadeInDelay1" style={{ marginBottom: 16 }}>
              {product.brand && (
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#C9A96E", fontFamily: "Montserrat", fontWeight: 700, marginBottom: 4 }}>
                  {product.brand}
                </p>
              )}
              {product.category && (
                <p style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#8A7F75", fontFamily: "Montserrat", fontWeight: 500 }}>
                  {product.category}
                </p>
              )}
            </div>

            {/* Name */}
            <h1 className="serif animate-fadeInDelay1" style={{ fontSize: "clamp(24px, 3.5vw, 38px)", color: "#1A1A1A", fontWeight: 400, marginBottom: 20, lineHeight: 1.2, letterSpacing: 1 }}>
              {product.name}
            </h1>

            {/* Gold divider */}
            <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
              <div style={{ width: 5, height: 5, background: "#C9A96E", borderRadius: "50%" }} />
            </div>

            {/* Price */}
            <p className="serif animate-fadeInDelay2" style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "#1A0A2E", fontWeight: 400, marginBottom: 12, letterSpacing: 1 }}>
              {product.price.toLocaleString()} <span style={{ fontSize: "0.55em", letterSpacing: 2, fontFamily: "Montserrat", fontWeight: 500, color: "#8A7F75" }}>сом.</span>
            </p>

            {/* Stock */}
            {stock && (
              <div className="animate-fadeInDelay2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <div className="stock-pulse" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: stock.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, fontFamily: "Montserrat", letterSpacing: 1.5, color: stock.color, fontWeight: 600, textTransform: "uppercase" }}>
                  {stock.label}
                </span>
              </div>
            )}

            {/* Volume selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="animate-fadeInDelay3" style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 8.5, letterSpacing: 3, textTransform: "uppercase", color: "#8A7F75", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 12 }}>
                  Объём: <span style={{ color: selectedSize ? "#1A0A2E" : "#C9A96E", letterSpacing: 1, fontWeight: 700 }}>{selectedSize || "не выбран"}</span>
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: 52, height: 42, padding: "0 12px",
                        border: selectedSize === s ? "1.5px solid #1A0A2E" : "1px solid #E8DDD0",
                        backgroundColor: selectedSize === s ? "#1A0A2E" : "transparent",
                        color: selectedSize === s ? "#C9A96E" : "#4A4040",
                        fontFamily: "Montserrat", fontSize: 11, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.22s",
                        letterSpacing: 0.5,
                      }}
                      onMouseEnter={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; } }}
                      onMouseLeave={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = "#E8DDD0"; (e.currentTarget as HTMLElement).style.color = "#4A4040"; } }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="animate-fadeInDelay3" style={{ marginBottom: 30 }}>
                <div style={{ borderLeft: "2px solid #C9A96E", paddingLeft: 16 }}>
                  <p style={{ fontSize: 11, color: "#6A6060", lineHeight: 1.9, fontFamily: "Montserrat", fontWeight: 300 }}>
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAdd}
              disabled={addingToCart || product.stock === 0}
              className={`btn-primary animate-fadeInDelay4${addingToCart ? " btn-loading" : ""}`}
              style={{
                width: "100%", textAlign: "center", fontSize: 9, letterSpacing: 3,
                opacity: product.stock === 0 ? 0.45 : 1,
                padding: "16px 32px",
              }}
            >
              {addingToCart ? "Добавляем..." : product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
            </button>

            {/* Extra info */}
            <div className="animate-fadeInDelay4" style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "fa-truck", text: "Бесплатная доставка от 5 000 сом." },
                { icon: "fa-shield-alt", text: "Гарантия подлинности" },
                { icon: "fa-undo", text: "Возврат в течение 14 дней" },
              ].map(item => (
                <div key={item.icon} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <i className={`fas ${item.icon}`} style={{ fontSize: 11, color: "#C9A96E", width: 14, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#8A7F75", fontFamily: "Montserrat", letterSpacing: 0.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
