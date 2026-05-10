import { useEffect, useRef, useState } from "react";
// Importamos tu flota para que el contador de naves sea automático
import { MI_FLOTA_CLAN } from "../Data/FlotaData";

export default function Hero({ navigate }) {
  const sectionsRef = useRef([]);
  
  // Estados automáticos
  const [memberCount, setMemberCount] = useState("-");
  const totalNaves = MI_FLOTA_CLAN.length;

  useEffect(() => {
    // 1. Lógica de aparición al hacer scroll (Intersection Observer)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.15 }
    );
    sectionsRef.current.forEach(el => el && observer.observe(el));

    // 2. Conexión con Discord para el TOTAL de miembros
    const fetchDiscordStats = async () => {
      try {
        // Tu código de invitación real es BPd4aNDwuF
        const inviteCode = "BPd4aNDwuF";
        
        // Usamos AllOrigins como proxy para evitar errores de CORS (bloqueo del navegador)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`
        )}`;

        const response = await fetch(proxyUrl);
        const json = await response.json();
        const data = JSON.parse(json.contents);

        // approximate_member_count incluye a todos los miembros (Online + Offline)
        if (data.approximate_member_count) {
          setMemberCount(data.approximate_member_count);
        } else {
          // Valor por defecto basado en tu última captura si falla la API
          setMemberCount(0); 
        }
      } catch (err) {
        console.error("Error cargando Discord Stats:", err);
        setMemberCount(0); 
      }
    };

    fetchDiscordStats();
    return () => observer.disconnect();
  }, []);

  const addRef = el => {
    if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
  };

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="hero" style={{ display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", minHeight: "100vh" }}>
        <div className="hero__bg-grid" />
        <div className="hero__glow" />
        <div className="hero__glow-2" />

        <div className="hero__main-layout" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "2rem",
          zIndex: 2 
        }}>
          
          <div className="hero__content" style={{ flex: 1 }}>
            <div className="hero__eyebrow">Organización · Star Citizen</div>

            <h1 className="hero__title">
              <span className="hero__title-gold">Dark Horizon</span>
              <span className="hero__title-outline">Logistics</span>
            </h1>

            <p className="hero__subtitle">
              Clan de élite en el universo de Star Citizen. Operaciones de combate,
              exploración y comercio en los rincones más peligrosos del espacio conocido.
            </p>

            <div className="hero__cta">
              <button className="btn btn-primary" onClick={() => navigate("contacto")}>Unirse al Clan</button>
              <button className="btn btn-outline" onClick={() => navigate("flota")}>Ver Flota</button>
            </div>
          </div>

          <div className="hero__manifesto-box" style={{
            background: "rgba(13, 17, 32, 0.4)",
            backdropFilter: "blur(10px)",
            padding: "2rem",
            borderLeft: "2px solid var(--gold)",
            minWidth: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            animation: "heroFadeUp 1s 0.3s ease both"
          }}>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.4rem" }}>Timezone</span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--white)" }}>EU · CET/CEST</span>
            </div>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.4rem" }}>Enfoque</span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--white)" }}>PvP · Exploración · Cargo</span>
            </div>
            <div>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.4rem" }}>Idioma</span>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 600, color: "var(--white)" }}>Español</span>
            </div>
          </div>
        </div>

        {/* Stats Dinámicos Actualizados */}
        <div className="hero__stats" style={{ justifyContent: "center", gap: "5rem" }}>
          <div className="hero__stat">
            <div className="hero__stat-number">{memberCount}</div>
            <div className="hero__stat-label">Miembros Totales</div>
          </div>
          <div className="hero__stat">
            {/* Sincronizado automáticamente con FlotaData.js */}
            <div className="hero__stat-number">{totalNaves}</div>
            <div className="hero__stat-label">Naves de la Flota</div>
          </div>
        </div>

        <div className="hero__scroll">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding: "5rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="fade-in" ref={addRef} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <span className="section-tag">Quiénes somos</span>
            <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
              No somos solo un <span>clan</span>
            </h2>
            <div className="gold-line" />
            <p className="section-subtitle">
              Dark Horizon Logistics nació como un grupo de amigos con una visión: construir una organización
              hispanohablante de referencia en Star Citizen. Tácticos, leales y siempre listos para la operación.
            </p>
          </div>

          <div className="card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { label: "Comercio / Cargo",   pct: "74%" },
              { label: "Exploración",        pct: "52%" },
              { label: "Combate PvP",        pct: "40%" },
              { label: "Minería",            pct: "28%" },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--gold)" }}>{item.pct}</span>
                </div>
                <div style={{ height: "3px", background: "var(--border)", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: item.pct, height: "100%", background: "var(--gold)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: "2rem 3rem 5rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="fade-in" ref={addRef}>
          <span className="section-tag">Valores</span>
          <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", marginBottom: "2.5rem" }}>
            El <span>código</span> Dark Horizon Logistics
          </h2>
        </div>
        <div className="fade-in" ref={addRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem" }}>
          {[
            { icon: "⚔", title: "Lealtad",      desc: "Los hermanos de clan siempre primero. Nunca se abandona a un piloto." },
            { icon: "🧭", title: "Táctica",      desc: "Cada operación se planifica. La improvisación es el lujo del que puede permitírselo." },
            { icon: "🔒", title: "Disciplina",   desc: "Reglas claras, respeto mutuo y comunicación efectiva en todo momento." },
            { icon: "🚀", title: "Ambición",     desc: "Siempre más lejos, siempre mejor. No hay sistema que no valga la pena explorar." },
          ].map(v => (
            <div key={v.title} className="card" style={{ padding: "1.8rem" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{v.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--white)", marginBottom: "0.6rem" }}>{v.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.65" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="fade-in" ref={addRef} style={{ padding: "4rem 3rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <span className="section-tag">¿Listo para unirte?</span>
        <h2 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginBottom: "1.5rem" }}>
          El universo es <span>enorme</span>
        </h2>
        <button className="btn btn-primary" onClick={() => navigate("contacto")}>Solicitar ingreso</button>
      </section>
    </div>
  );
}