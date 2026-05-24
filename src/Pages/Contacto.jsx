import { useEffect, useRef, useState } from "react";

const CHANNELS = [
  { icon:"💬", name:"Discord", desc:"El hub principal del clan. Coordinación, eventos, voz y texto.", link:"discord.gg/GFz999YmRz", href:"https://discord.gg/4mHvEatEEd" },
  { icon:"🌐", name:"RSI Organization", desc:"Nuestra página oficial en Roberts Space Industries.", link:"robertsspaceindustries.com", href:"https://robertsspaceindustries.com/en/orgs/DHLO/#manifesto" },
];

export default function Contacto() {
  // Estado inicial extendido con los nuevos campos
  const [form, setForm] = useState({ 
    profileType: "nuevo_integrante", // Por defecto
    handle: "", 
    discord: "", 
    role: "", 
    about: "",
    // Campos para Emisario Externo
    org: "",
    motivo: "",
    rango: "",
    disponibilidad: ""
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeRefs = useRef([]);

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

  // Validación dinámica según el tipo de perfil seleccionado
  const isFormValid = () => {
    if (!form.handle || !form.discord) return false;
    if (form.profileType === "emisario_externo") {
      return form.org && form.motivo && form.rango;
    }
    return true; // Para nuevo integrante los campos adicionales son opcionales
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    
    if (!DISCORD_WEBHOOK_URL) {
        alert("Error de configuración: No se encontró la dirección de transmisión.");
        return;
    }

    setLoading(true);

    // Estructura base del Embed de Discord
    let embed = {
      timestamp: new Date(),
      footer: { text: "Sistema de Reclutamiento Dark Horizon" }
    };

    // Configuración condicional según el perfil
    if (form.profileType === "nuevo_integrante") {
      embed.title = "📑 NUEVA SOLICITUD DE ALISTAMIENTO";
      embed.color = 15844367; // Color Oro DHL
      embed.fields = [
        { name: "👨‍🚀 Handle RSI", value: `\`${form.handle}\``, inline: true },
        { name: "💬 Discord", value: `\`${form.discord}\``, inline: true },
        { name: "🏹 Rol de Interés", value: form.role || "No especificado", inline: true },
        { name: "📝 Manifiesto", value: form.about || "Sin descripción adicional." }
      ];
    } else {
      embed.title = "EMISARIO EXTERNO / SOCIO COMERCIAL";
      embed.color = 3447003; // Color Azul/Diplomático corporativo
      embed.fields = [
        { name: "👨‍🚀 Handle RSI", value: `\`${form.handle}\``, inline: true },
        { name: "💬 Discord", value: `\`${form.discord}\``, inline: true },
        { name: "🛡️ Organización de procedencia", value: form.org, inline: false },
        { name: "🔮 Motivo del enlace", value: form.motivo, inline: false },
        { name: "🎖️ Rango/Cargo", value: form.rango, inline: true },
        { name: "🚀 Disponibilidad y Rol (Naves/Día a día)", value: form.disponibilidad || "No especificado", inline: false }
      ];
    }

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
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
              Busca tu destino entre las estrellas o formaliza un enlace comercial con nuestra flota.
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
                    Tus datos han llegado al canal de solicitudes. Un oficial revisará la transmisión pronto.
                  </span>
                </div>
              ) : (
                <>
                  {/* SELECTOR DE TIPO DE PERFIL */}
                  <div className="form-group">
                    <label className="form-label">Tipo de Perfil *</label>
                    <select className="form-select" name="profileType" value={form.profileType} onChange={handleChange}>
                      <option value="nuevo_integrante">Nuevo Integrante / Alistamiento</option>
                      <option value="emisario_externo">Emisario Externo / Socio Comercial</option>
                    </select>
                  </div>

                  {/* CAMPOS COMUNES */}
                  <div className="form-group">
                    <label className="form-label">Handle en Star Citizen *</label>
                    <input className="form-input" name="handle" value={form.handle} onChange={handleChange} placeholder="TuNombreEnJuego" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usuario de Discord *</label>
                    <input className="form-input" name="discord" value={form.discord} onChange={handleChange} placeholder="ejemplo#0000" />
                  </div>

                  {/* CAMPOS EXCLUSIVOS: NUEVO INTEGRANTE */}
                  {form.profileType === "nuevo_integrante" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Rol preferido</label>
                        <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                          <option value="">-- Selecciona un rol --</option>
                          <option value="Piloto de Combate">Vanguardia e Interdicción</option>
                          <option value="Explorador">Coerción Táctica</option>
                          <option value="Capitán de Cargo">Inteligencia</option>
                          <option value="Capitán de Cargo">Logística</option>
                          <option value="Capitán de Cargo">Extracción</option>
                          <option value="Minero">Médico / Soporte</option>
                          <option value="Médico / Soporte">Ingeniero</option>
                          <option value="Sin preferencia">Sin preferencia</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cuéntanos sobre ti</label>
                        <textarea className="form-textarea" name="about" value={form.about} onChange={handleChange}
                          placeholder="¿Qué buscas en un clan? ¿Qué naves tienes?" />
                      </div>
                    </>
                  )}

                  {/* CAMPOS EXCLUSIVOS: EMISARIO EXTERNO (SEGÚN LA IMAGEN) */}
                  {form.profileType === "emisario_externo" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Organización de procedencia *</label>
                        <input className="form-input" name="org" value={form.org} onChange={handleChange} placeholder="Nombre y siglas de tu facción" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Motivo del enlace *</label>
                        <select className="form-select" name="motivo" value={form.motivo} onChange={handleChange}>
                          <option value="">-- Selecciona un motivo --</option>
                          <option value="Pactos territoriales">Pactos territoriales</option>
                          <option value="Escolta armada">Escolta armada</option>
                          <option value="Compra de material procesado">Compra de material procesado</option>
                          <option value="Intercambio de inteligencia">Intercambio de inteligencia</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Rango / Cargo *</label>
                        <input className="form-input" name="rango" value={form.rango} onChange={handleChange} placeholder="Tu posición oficial dentro de tu estructura de mando" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Disponibilidad y Rol</label>
                        <textarea className="form-textarea" name="disponibilidad" value={form.disponibilidad} onChange={handleChange}
                          placeholder="Qué naves pesadas o industriales aportas a la flotilla y qué te gusta hacer en el día a día." />
                      </div>
                      
                      {/* Advertencia del sistema extraída visualmente del texto de la imagen */}
                      <div style={{ backgroundColor: "rgba(255,0,0,0.05)", borderLeft: "3px solid #ff4444", padding: "0.8rem", margin: "1rem 0", fontSize: "0.75rem", color: "#ffb3b3" }}>
                        <strong>[ADVERTENCIA DEL SISTEMA]</strong><br />
                        Mantengan la disciplina en la frecuencia. Todo mensaje que no cumpla con los formatos de registro o que comprometa el anonimato y la seguridad de la corporación será purgado de forma inmediata por el sistema de contrainformación.
                      </div>
                    </>
                  )}

                  <button 
                    className="btn btn-primary form-submit" 
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    style={{ opacity: (loading || !isFormValid()) ? 0.5 : 1, width: "100%" }}
                  >
                    {loading ? "TRANSMITIENDO..." : "Enviar solicitud →"}
                  </button>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                    * Campos obligatorios. La información se enviará cifrada directamente a nuestra base de mando.
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