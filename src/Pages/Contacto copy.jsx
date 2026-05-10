import { useEffect, useRef, useState } from "react";

const CHANNELS = [
  { icon:"💬", name:"Discord",         desc:"El hub principal del clan. Coordinación, eventos, voz y texto.",           link:"discord.gg/GFz999YmRz",            href:"https://discord.gg/GFz999YmRz" },
  { icon:"🌐", name:"RSI Organization",desc:"Nuestra página oficial en Roberts Space Industries.",                       link:"robertsspaceindustries.com",         href:"https://robertsspaceindustries.com" },
];

export default function Contacto() {
  const [form,      setForm]      = useState({ handle:"", discord:"", role:"", about:"" });
  const [submitted, setSubmitted] = useState(false);
  const fadeRefs = useRef([]);

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
  const handleSubmit = () => { if (!form.handle || !form.discord) return; setSubmitted(true); };

  return (
    <div className="page">
      <section className="contacto">
        <div className="contacto__content">
          {/* Header */}
          <div className="contacto__header fade-in" ref={addRef}>
            <span className="section-tag">Reclutamiento</span>
            <h1 className="section-title" style={{ fontSize:"clamp(2.5rem, 5vw, 4rem)", marginBottom:"0.5rem" }}>
              Únete a <span>Dark Horizon</span>
            </h1>
            <div className="gold-line" style={{ margin:"1.5rem auto" }} />
            <p className="section-subtitle" style={{ textAlign:"center", margin:"0 auto" }}>
              Buscamos pilotos comprometidos, con ganas de aprender y construir algo grande.
              Veteranos o rookies, todos tienen un lugar aquí.
            </p>
          </div>

          <div className="contacto__layout fade-in" ref={addRef}>
            {/* Channels */}
            <div className="contacto__info">
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--white)", marginBottom:"1.5rem" }}>
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
              <div className="card" style={{ padding:"1.8rem", marginTop:"0.5rem" }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--white)", marginBottom:"1.2rem" }}>
                  Requisitos mínimos
                </h3>
                {["Juego activo de Star Citizen","Discord instalado y micrófono","Disponibilidad mínima 2 noches/semana","Hablar español","Actitud positiva y trabajo en equipo"].map(req => (
                  <div key={req} style={{ display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.6rem 0", borderBottom:"1px solid var(--border)", fontSize:"0.85rem", color:"var(--muted)" }}>
                    <span style={{ color:"var(--gold)", fontSize:"0.7rem" }}>◆</span>{req}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="contacto__form">
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--white)", marginBottom:"1.5rem" }}>
                Formulario de solicitud
              </h2>
              {submitted ? (
                <div className="form-success">
                  ◆ SOLICITUD RECIBIDA ◆<br /><br />
                  Revisaremos tu candidatura y nos pondremos en contacto por Discord en las próximas 48h.
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Handle en Star Citizen *</label>
                    <input className="form-input" name="handle" value={form.handle} onChange={handleChange} placeholder="TuNombreEnJuego" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usuario de Discord *</label>
                    <input className="form-input" name="discord" value={form.discord} onChange={handleChange} placeholder="usuario#0000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rol preferido</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                      <option value="">-- Selecciona un rol --</option>
                      <option value="combate">Piloto de Combate</option>
                      <option value="explorador">Explorador</option>
                      <option value="cargo">Capitán de Cargo</option>
                      <option value="miner">Minero</option>
                      <option value="medic">Médico / Soporte</option>
                      <option value="cualquiera">Cualquiera / Sin preferencia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cuéntanos sobre ti</label>
                    <textarea className="form-textarea" name="about" value={form.about} onChange={handleChange}
                      placeholder="¿Cuánto llevas jugando? ¿Qué buscas en un clan? ¿Naves que tienes?" />
                  </div>
                  <button className="btn btn-primary form-submit" onClick={handleSubmit}
                          style={{ opacity:(!form.handle || !form.discord) ? 0.5 : 1 }}>
                    Enviar solicitud →
                  </button>
                  <p style={{ fontSize:"0.72rem", color:"var(--muted)", marginTop:"0.5rem" }}>
                    * Campos obligatorios. Tu solicitud será revisada por el Consejo del clan.
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