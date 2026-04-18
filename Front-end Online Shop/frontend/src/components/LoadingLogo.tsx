interface Props {
  height?: string;
  size?: number;
}

export default function LoadingLogo({ height = "50vh", size = 80 }: Props) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height, background: "#080810",
    }}>
      <div style={{ textAlign: "center" }}>
        <div
          className="loading-logo-ring"
          style={{
            width: size, height: size,
            border: "1px solid rgba(196,154,80,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
            background: "transparent",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 8,
            border: "1px solid rgba(196,154,80,0.15)",
          }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: Math.round(size * 0.28),
            fontWeight: 300,
            fontStyle: "italic",
            color: "#C49A50",
            letterSpacing: 2,
            userSelect: "none",
            position: "relative", zIndex: 1,
          }}>
            El
          </span>
        </div>
        <p
          className="loading-logo-text"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 7.5, letterSpacing: 7,
            textTransform: "uppercase",
            color: "rgba(196,154,80,0.6)",
            fontWeight: 400, margin: 0,
          }}
        >
          ELIXIR
        </p>
      </div>
    </div>
  );
}
