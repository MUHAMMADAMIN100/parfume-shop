interface Props {
  height?: string;
  size?: number;
}

export default function LoadingLogo({ height = "50vh", size = 80 }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
      <div style={{ textAlign: "center" }}>
        <div
          className="loading-logo-ring"
          style={{
            width: size,
            height: size,
            border: "1px solid #C9A96E",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            backgroundColor: "#FFFFFF",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 6,
            border: "1px solid rgba(201,169,110,0.3)",
            borderRadius: "50%",
          }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: Math.round(size * 0.26),
            fontWeight: 400,
            fontStyle: "italic",
            color: "#C9A96E",
            letterSpacing: 2,
            userSelect: "none",
            position: "relative",
            zIndex: 1,
          }}>
            El
          </span>
        </div>
        <p
          className="loading-logo-text"
          style={{
            fontSize: 8,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C9A96E",
            fontFamily: "Montserrat",
            fontWeight: 600,
            margin: 0,
          }}
        >
          ELIXIR
        </p>
      </div>
    </div>
  );
}
