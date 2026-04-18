import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSave } from "react-icons/fi";
import type { IconType } from "react-icons";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  sizes: string;
  stock: number;
}

const Icon: React.FC<{ icon: IconType; size?: number }> = ({ icon: IconComponent, size }) => (
  <IconComponent size={size} />
);

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: 6,
  fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
  color: "#555", fontFamily: "Montserrat", fontWeight: 600
};

const fieldStyle: React.CSSProperties = {
  border: "1px solid #D9CFC0", padding: "10px 14px", width: "100%",
  fontFamily: "Montserrat", fontSize: 13, background: "#FFFFFF",
  outline: "none", transition: "border-color 0.2s"
};

const VOLUMES = ["30 мл", "50 мл", "75 мл", "100 мл", "150 мл", "200 мл"];

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>({
    name: "", description: "", price: 0, image: "",
    category: "", brand: "", sizes: "", stock: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`)
        .then(res => {
          const d = res.data;
          setProduct({
            ...d,
            sizes: Array.isArray(d.sizes) ? d.sizes.join(", ") : (d.sizes || ""),
            brand: d.brand || "",
            stock: d.stock ?? 0
          });
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === "price" || name === "stock" ? Number(value) : value }));
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.url) setProduct(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const payload = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        sizes: product.sizes
          ? product.sizes.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      };

      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, payload,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessage("Товар обновлён!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessage("Товар создан!");
      }

      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при сохранении");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div className="animate-fadeIn" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D9CFC0", maxWidth: 760, margin: "24px auto", padding: "40px 48px" }}>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 className="serif" style={{ fontSize: 26, color: "#1A0A2E", letterSpacing: 3, fontWeight: 500 }}>
          {id ? "Редактирование аромата" : "Добавить аромат"}
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <div style={{ width: 20, height: 1, backgroundColor: "#C9A96E" }} />
          <div style={{ width: 4, height: 4, backgroundColor: "#1A0A2E", borderRadius: "50%" }} />
          <div style={{ width: 20, height: 1, backgroundColor: "#C9A96E" }} />
        </div>
      </div>

      {message && (
        <div className="animate-fadeIn" style={{ backgroundColor: "#F0FFF0", border: "1px solid #C9A96E", padding: "12px 20px", marginBottom: 24, textAlign: "center", fontFamily: "Montserrat", fontSize: 12, color: "#1A0A2E", letterSpacing: 1 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Название */}
        <div>
          <label style={labelStyle}>Название аромата</label>
          <input name="name" type="text" value={product.name} onChange={handleChange} required style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          />
        </div>

        {/* Бренд */}
        <div>
          <label style={labelStyle}>Бренд / Дом моды</label>
          <input name="brand" type="text" value={product.brand} onChange={handleChange}
            placeholder="Chanel, Dior, Tom Ford..." style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          />
        </div>

        {/* Изображение */}
        <div>
          <label style={labelStyle}>Изображение</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
              border: "1px solid #C9A96E", color: "#C9A96E", padding: "8px 18px",
              fontFamily: "Montserrat", fontSize: 10, letterSpacing: 2,
              textTransform: "uppercase", background: "transparent", transition: "all 0.2s",
              borderRadius: 8,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; }}
            >
              <i className="fas fa-upload" style={{ fontSize: 12 }} />
              {uploading ? "Загрузка..." : "Загрузить с компьютера"}
              <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: "none" }} disabled={uploading} />
            </label>
            {product.image && (
              <img src={product.image} alt="preview" style={{ width: 56, height: 56, objectFit: "cover", border: "1px solid #D9CFC0", borderRadius: 6 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
          <input name="image" type="text" value={product.image} onChange={handleChange}
            placeholder="или вставьте URL изображения" style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          />
        </div>

        {/* Категория */}
        <div>
          <label style={labelStyle}>Категория</label>
          <select name="category" value={product.category} onChange={handleChange} style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          >
            <option value="">— Выберите категорию —</option>
            <option value="Мужские">Мужские</option>
            <option value="Женские">Женские</option>
            <option value="Унисекс">Унисекс</option>
            <option value="Подарочные наборы">Подарочные наборы</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Описание / Ноты аромата</label>
          <textarea name="description" value={product.description} onChange={handleChange}
            rows={3} style={{ ...fieldStyle, resize: "vertical" }}
            placeholder="Верхние ноты: бергамот, лимон. Сердце: роза, жасмин. База: сандал, мускус."
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          />
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Цена (сомони)</label>
            <input name="price" type="number" value={product.price} onChange={handleChange} required style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = "#C9A96E")}
              onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Остаток на складе</label>
            <input name="stock" type="number" min={0} value={product.stock} onChange={handleChange} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = "#C9A96E")}
              onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
            />
          </div>
        </div>

        {/* Объёмы */}
        <div>
          <label style={labelStyle}>Объёмы (выбор нескольких)</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            {VOLUMES.map(v => {
              const selected = product.sizes.split(",").map(s => s.trim()).includes(v);
              return (
                <button key={v} type="button"
                  onClick={() => {
                    const arr = product.sizes ? product.sizes.split(",").map(s => s.trim()).filter(Boolean) : [];
                    const next = selected ? arr.filter(x => x !== v) : [...arr, v];
                    setProduct(prev => ({ ...prev, sizes: next.join(", ") }));
                  }}
                  style={{
                    padding: "8px 16px",
                    border: selected ? "2px solid #1A0A2E" : "1px solid #D9CFC0",
                    backgroundColor: selected ? "#1A0A2E" : "#fff",
                    color: selected ? "#C9A96E" : "#1A1A1A",
                    fontFamily: "Montserrat", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s", borderRadius: 4,
                  }}
                >{v}</button>
              );
            })}
          </div>
          <input name="sizes" type="text" value={product.sizes} onChange={handleChange}
            placeholder="или введите вручную: 30 мл, 50 мл, 100 мл" style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = "#C9A96E")}
            onBlur={e => (e.target.style.borderColor = "#D9CFC0")}
          />
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <button type="submit" disabled={loading} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 40px" }}>
            <Icon icon={FiSave} size={16} />
            {loading ? "Сохранение..." : "Сохранить аромат"}
          </button>
        </div>
      </form>
    </div>
  );
}
