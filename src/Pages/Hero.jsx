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
        const inviteCode = "BPd4aNDwuF";
        const url = `https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`;
        
        // Usamos un proxy alternativo (Cors-anywhere o similar) si AllOrigins falla
        // Pero mantendremos AllOrigins añadiendo un timestamp para evitar caché
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Error de red");

        const json = await response.json();
        
        if (json.contents) {
          const data = JSON.parse(json.contents);
          if (data.approximate_member_count !== undefined) {
            setMemberCount(data.approximate_member_count);
          } else {
            setMemberCount("N/A"); // No se encontró el dato en el JSON
          }
        } else {
          setMemberCount("Error"); // El proxy respondió vacío
        }
        
      } catch (err) {
        console.error("Error cargando Discord Stats:", err);
        setMemberCount("Offline"); // Cambio de 0 a "Offline" para saber que falló la conexión
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
              Eficiencia en la luz, discreción absoluta en la sombra. Sindicato de frontera especializado en operaciones tácticas encubiertas, 
              pillaje e industrialización autónoma. Aseguramos la ruta y procesamos el botín sin dejar rastro. Sin preguntas.
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
              Dark Horizon Logistics [DHLo], consolidada administrativamente en el año 2956 tras nacer en 2947 
              con cinco operadores independientes en la estación Olisar, destaca por su discreción y eficiencia 
              en rutas hostiles de los sistemas desregulados. Aprendiendo que el volumen visible arruina la rentabilidad, 
              el grupo se especializó en operaciones rápidas y procesamiento directo de materiales. Con la apertura de nuevos sectores comerciales, 
              integraron una flota pesada y autónoma que incluye naves de transporte, patrulla y laboratorios científicos. Su estructura descentralizada y 
              blindada digitalmente protege el anonimato de sus fundadores mientras operan de manera autosuficiente ante cualquier amenaza. Actualmente, 
              se presentan en el Spectrum como una agencia de transporte eficiente, consolidándose en la frontera como los verdaderos dueños del horizonte.
            </p>
          </div>

          <div className="card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { label: "Comercio / Cargo",   pct: "74%" },
              { label: "Exploración",        pct: "52%" },
              { label: "Minería",        pct: "40%" },
              { label: "Combate PvP",            pct: "28%" },
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
            { icon: "⚔", title: "PROTOCOLO DE CONFIDENCIALIDAD Y ANONIMATO",      desc: "Se exige secreto absoluto sobre la flota pesada, la identidad de los líderes y los contratos especiales. Las comunicaciones sensibles se realizan estrictamente por canales encriptados secundarios, dejando el Spectrum solo para lo rutinario." },
            { icon: "🧭", title: "DOCTRINA DE SEGURIDAD INDUSTRIAL",      desc: "Las operaciones se protegen mediante el control cuántico del sector para agilizar la extracción e industrialización in-situ. La escolta táctica tiene orden de responder inmediatamente con fuego pesado ante cualquier amenaza." },
            { icon: "🗺️​", title: "DISCIPLINA DE FLOTA Y AUTOSUFICIENCIA",   desc: "Es obligatorio acatar las directrices de las divisiones de Inteligencia, Coerción y Vanguardia para asegurar la coordinación de la flota. Ante bajas o accidentes, la prioridad absoluta es la evacuación médica del personal y la recuperación de materiales." },
            { icon: "🔒​", title: "SISTEMA ECONÓMICO CORPORATIVO",     desc: "Las ganancias de contratos especiales y materias primas procesadas se distribuyen de forma equitativa, transparente y proporcional entre los miembros que hayan participado activamente en la misión." },
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