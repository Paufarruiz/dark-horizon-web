import { useEffect, useRef, useState } from "react";

const CHANNELS = [
  { icon:"💬", name:"Discord", desc:"El hub principal del clan. Coordinación, eventos, voz y texto.", link:"discord.gg/GFz999YmRz", href:"https://discord.gg/GFz999YmRz" },
  { icon:"🌐", name:"RSI Organization", desc:"Nuestra página oficial en Roberts Space Industries.", link:"robertsspaceindustries.com", href:"https://robertsspaceindustries.com" },
];

export default function Contacto() {
  const [form, setForm] = useState({ handle: "", discord: "", role: "", about: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeRefs = useRef([]);

  // URL del Webhook extraída de forma segura desde las variables de entorno de Vite
  const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.handle || !form.discord) return;
    
    // Verificación de seguridad por si la variable no carga
    if (!DISCORD_WEBHOOK_URL) {
        alert("Error de configuración: No se encontró la dirección de transmisión.");
        return;
    }

    setLoading(true);

    const discordMessage = {
      embeds: [{
        title: "📑 NUEVA SOLICITUD DE ALISTAMIENTO",
        color: 15844367, // Color Oro DHL
        fields: [
          { name: "👨‍🚀 Handle RSI", value: `\`${form.handle}\``, inline: true },
          { name: "💬 Discord", value: `\`${form.discord}\``, inline: true },
          { name: "🏹 Rol de Interés", value: form.role || "No especificado", inline: true },
          { name: "📝 Manifiesto", value: form.about || "Sin descripción adicional." }
        ],
        footer: { text: "Sistema de Reclutamiento Dark Horizon" },
        timestamp: new Date()
      }]
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Error en la transmisión");
      }
    } catch (error) {
      alert("Hubo un fallo en la transmisión. Inténtalo de nuevo.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="contacto">
        <div className="contacto__content">
          <div className="contacto__header fade-in" ref={addRef}>
            <span className="section-tag">Reclutamiento</span>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "0.5rem" }}>
              Únete a <span>Dark Horizon</span>
            </h1>
            <div className="gold-line" style={{ margin: "1.5rem auto" }} />
            <p className="section-subtitle" style={{ textAlign: "center", margin: "0 auto" }}>
              Buscamos pilotos comprometidos, con ganas de aprender y construir algo grande.
            </p>
          </div>

          <div className="contacto__layout fade-in" ref={addRef}>
            <div className="contacto__info">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)", marginBottom: "1.5rem" }}>
                Dónde encontrarnos
              </h2>
              {CHANNELS.map(ch => (
                <div key={ch.name} className="contacto__channel">
                  <div className="contacto__channel-icon">{ch.icon}</div>
                  <div>
                    <div className="contacto__channel-name">{ch.name}</div>
                    <p className="contacto__channel-desc">{ch.desc}</p>
                    <a className="contacto__channel-link" href={ch.href} target="_blank" rel="noreferrer">
                      {ch.link} →
                    </a>
                  </div>
                </div>
              ))}
              <div className="card" style={{ padding: "1.8rem", marginTop: "0.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)", marginBottom: "1.2rem" }}>
                  Requisitos mínimos
                </h3>
                {["Juego activo de Star Citizen", "Discord instalado y micrófono", "Disponibilidad mínima 2 noches/semana", "Hablar español", "Actitud positiva y trabajo en equipo"].map(req => (
                  <div key={req} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.6rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--muted)" }}>
                    <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>◆</span>{req}
                  </div>
                ))}
              </div>
            </div>

            <div className="contacto__form">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)", marginBottom: "1.5rem" }}>
                Formulario de solicitud
              </h2>
              {submitted ? (
                <div className="form-success" style={{ border: "1px solid var(--gold)", padding: "2rem", textAlign: "center", color: "var(--gold)" }}>
                  ◆ SOLICITUD TRANSMITIDA ◆<br /><br />
                  <span style={{ color: "var(--white)", fontSize: "0.9rem" }}>
                    Tus datos han llegado al canal de solicitudes. Un oficial revisará tu candidatura pronto.
                  </span>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Handle en Star Citizen *</label>
                    <input className="form-input" name="handle" value={form.handle} onChange={handleChange} placeholder="TuNombreEnJuego" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usuario de Discord *</label>
                    <input className="form-input" name="discord" value={form.discord} onChange={handleChange} placeholder="ejemplo#0000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rol preferido</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                      <option value="">-- Selecciona un rol --</option>
                      <option value="Piloto de Combate">Piloto de Combate</option>
                      <option value="Explorador">Explorador</option>
                      <option value="Capitán de Cargo">Capitán de Cargo</option>
                      <option value="Minero">Minero</option>
                      <option value="Médico / Soporte">Médico / Soporte</option>
                      <option value="Sin preferencia">Sin preferencia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cuéntanos sobre ti</label>
                    <textarea className="form-textarea" name="about" value={form.about} onChange={handleChange}
                      placeholder="¿Qué buscas en un clan? ¿Qué naves tienes?" />
                  </div>
                  <button 
                    className="btn btn-primary form-submit" 
                    onClick={handleSubmit}
                    disabled={loading || !form.handle || !form.discord}
                    style={{ opacity: (loading || !form.handle || !form.discord) ? 0.5 : 1, width: "100%" }}
                  >
                    {loading ? "TRANSMITIENDO..." : "Enviar solicitud →"}
                  </button>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                    * Campos obligatorios. La información se enviará directamente a nuestra base de mando.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}