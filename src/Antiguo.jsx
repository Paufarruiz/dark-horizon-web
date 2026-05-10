import { useEffect, useRef, useState } from "react";
import "./App.css";

/* ──────────────────────────────────────────────
   DATOS DEL CLAN
────────────────────────────────────────────── */
const SHIPS = [
  {
    name: "Aegis Hammerhead",
    manufacturer: "Aegis Dynamics",
    shipClass: "Clase Capital",
    role: "combat",
    roleLabel: "Combate",
    desc:
      "Nuestra nave insignia. Portadora de cañones de largo alcance y plataformas defensivas múltiples. Desplegada en operaciones de alto riesgo y control de zonas.",
    stats: [
      { key: "Tripulación", val: "9" },
      { key: "Cañones", val: "6x S5" },
      { key: "Blindaje", val: "Clase A" },
      { key: "Rango", val: "Alta" },
    ],
  },
  {
    name: "Drake Caterpillar",
    manufacturer: "Drake Interplanetary",
    shipClass: "Clase Pesada",
    role: "transport",
    roleLabel: "Transporte",
    desc:
      "Columna vertebral logística de la CDH. Capacidad de carga modular y armamento defensivo que permite misiones de suministro en zonas hostiles.",
    stats: [
      { key: "Tripulación", val: "5" },
      { key: "Carga", val: "576 SCU" },
      { key: "Velocidad", val: "154 m/s" },
      { key: "Módulos", val: "4" },
    ],
  },
  {
    name: "Anvil Arrow",
    manufacturer: "Anvil Aerospace",
    shipClass: "Clase Ligera",
    role: "combat",
    roleLabel: "Combate",
    desc:
      "Interceptor rápido para operaciones de escolta y superioridad aérea. Su perfil pequeño y maniobrabilidad extrema la convierten en letal a corta distancia.",
    stats: [
      { key: "Tripulación", val: "1" },
      { key: "SCM", val: "310 m/s" },
      { key: "Armas", val: "4x S3" },
      { key: "Rol", val: "Escolta" },
    ],
  },
  {
    name: "MISC Prospector",
    manufacturer: "MISC",
    shipClass: "Clase Industrial",
    role: "mining",
    roleLabel: "Minería",
    desc:
      "Unidad de extracción autónoma. Equipada con rayos de fractura cuántica y sistemas de refinado en bruto para operaciones mineras en cinturones de asteroides.",
    stats: [
      { key: "Tripulación", val: "1" },
      { key: "Depósito", val: "32 SCU" },
      { key: "Rayos", val: "2x Minería" },
      { key: "Autonomía", val: "Alta" },
    ],
  },
  {
    name: "Origin 315p",
    manufacturer: "Origin Jumpworks",
    shipClass: "Clase Media",
    role: "recon",
    roleLabel: "Reconocimiento",
    desc:
      "Explorador de largo alcance con sensores avanzados. Utilizado para mapear rutas de salto, localizar recursos y obtener inteligencia táctica previa a operaciones.",
    stats: [
      { key: "Tripulación", val: "1" },
      { key: "Sensores", val: "S2 Extended" },
      { key: "Rango", val: "Máximo" },
      { key: "Sigilo", val: "Alto" },
    ],
  },
  {
    name: "Crusader C2 Hercules",
    manufacturer: "Crusader Industries",
    shipClass: "Clase Capital",
    role: "transport",
    roleLabel: "Transporte",
    desc:
      "Nave de transporte militar de gran tonelaje. Capacidad para desplegar vehículos terrestres y operar como base avanzada en zonas de conflicto.",
    stats: [
      { key: "Tripulación", val: "4" },
      { key: "Carga", val: "696 SCU" },
      { key: "Rampas", val: "2 traseras" },
      { key: "Vehículos", val: "4+" },
    ],
  },
];

const EVENTS = [
  {
    day: "15",
    month: "Jun",
    type: "Operación Táctica",
    name: "Noche de Asalto — Grim HEX",
    desc:
      "Operación de control coordinado en la estación Grim HEX. Flota completa en formación delta. Briefing 20:00h — entrada en servidor 21:00h.",
  },
  {
    day: "22",
    month: "Jun",
    type: "Evento Social",
    name: "Torneo Interno de Carreras",
    desc:
      "Primera liga interna de la CDH. Pistas en Lorville y ArcCorp. Inscripción abierta para pilotos de cualquier rango. Premios en aUEC.",
  },
  {
    day: "01",
    month: "Jul",
    type: "Operación Económica",
    name: "Convoy CDH — Ruta Stanton",
    desc:
      "Convoy de transporte masivo cruzando el sistema Stanton. Se necesitan escoltas y naves de carga. Contacta con el Oficial de Logística para asignación.",
  },
  {
    day: "12",
    month: "Jul",
    type: "Instrucción",
    name: "Academia de Vuelo CDH — Módulo Combate",
    desc:
      "Entrenamiento abierto para reclutas y mandos. Maniobras de evasión, formaciones de combate y coordinación de flota. Duración estimada 3 horas.",
  },
];

/* ──────────────────────────────────────────────
   STAR FIELD
────────────────────────────────────────────── */
function StarField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const count = 180;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 2.5 + 0.5;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --d: ${(Math.random() * 4 + 2).toFixed(1)}s;
        --delay: ${(Math.random() * 5).toFixed(1)}s;
        --min-op: ${(Math.random() * 0.2 + 0.05).toFixed(2)};
        --max-op: ${(Math.random() * 0.5 + 0.4).toFixed(2)};
      `;
      container.appendChild(star);
    }
  }, []);

  return <div className="stars-bg" ref={containerRef} />;
}

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
function Navbar({ onNav }) {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => onNav("inicio")}>
        <div className="nav-logo-icon">
          <span>CDH</span>
        </div>
        <div className="nav-logo-text">
          <span className="nav-logo-name">DARK HORIZON</span>
          <span className="nav-logo-tag">CORPORACIÓN</span>
        </div>
      </div>
      <ul className="nav-links">
        <li><a onClick={() => onNav("inicio")}>Inicio</a></li>
        <li><a onClick={() => onNav("flota")}>Flota</a></li>
        <li><a onClick={() => onNav("eventos")}>Eventos</a></li>
        <li><a className="nav-cta" onClick={() => onNav("contacto")}>Únete</a></li>
      </ul>
    </nav>
  );
}

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
function Hero({ onNav }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />

      <p className="hero-tag">// Corporación Dark Horizon — CDH</p>

      <h1 className="hero-title">
        Domina el
        <br />
        <span className="hero-title-accent">universo</span>
        <br />
        con nosotros
      </h1>

      <p className="hero-title-sub">Star Citizen · Organización Hispana</p>

      <p className="hero-desc">
        La CDH es una corporación operativa en el universo de Star Citizen.
        Combate, comercio, minería y exploración. Operamos con disciplina,
        lealtad y un propósito claro: expandir nuestro alcance en cada sistema.
      </p>

      <div className="hero-buttons">
        <a className="btn-primary" onClick={() => onNav("contacto")}>
          Solicitar ingreso
        </a>
        <a className="btn-secondary" onClick={() => onNav("flota")}>
          Ver flota
        </a>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-num">48+</span>
          <span className="hero-stat-label">Miembros</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">6</span>
          <span className="hero-stat-label">Naves activas</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">3</span>
          <span className="hero-stat-label">Sistemas</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">2yr</span>
          <span className="hero-stat-label">En activo</span>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Explorar</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FLOTA
────────────────────────────────────────────── */
function Flota() {
  return (
    <section className="section section-bg-alt" id="flota">
      <p className="section-label">Flota operativa</p>
      <h2 className="section-title">Nuestras naves</h2>

      <div className="fleet-grid">
        {SHIPS.map((ship, i) => (
          <div className="ship-card" key={i}>
            <div className="ship-class">{ship.shipClass}</div>
            <div className="ship-name">{ship.name}</div>
            <div className="ship-manufacturer">{ship.manufacturer}</div>
            <div className={`ship-role-badge ${ship.role}`}>{ship.roleLabel}</div>
            <p className="ship-desc">{ship.desc}</p>
            <div className="ship-stats">
              {ship.stats.map((s, j) => (
                <div className="ship-stat" key={j}>
                  <span className="ship-stat-val">{s.val}</span>
                  <span className="ship-stat-key">{s.key}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   EVENTOS
────────────────────────────────────────────── */
function Eventos() {
  return (
    <section className="section" id="eventos">
      <p className="section-label">Operaciones & agenda</p>
      <h2 className="section-title">Próximos eventos</h2>

      <div className="events-layout">
        <div className="events-list">
          {EVENTS.map((ev, i) => (
            <div className="event-item" key={i}>
              <div className="event-date">
                <span className="event-date-day">{ev.day}</span>
                <span className="event-date-month">{ev.month}</span>
              </div>
              <div className="event-content">
                <div className="event-type">
                  <span className="event-dot" />
                  {ev.type}
                </div>
                <div className="event-name">{ev.name}</div>
                <p className="event-desc">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="events-sidebar">
          <div className="sidebar-panel">
            <div className="sidebar-panel-title">Estado Operacional</div>
            <div className="ops-status-row">
              <span className="ops-status-label">Flota de combate</span>
              <span className="ops-status-val active">ACTIVA</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Operaciones logísticas</span>
              <span className="ops-status-val active">ACTIVA</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Escuadrones de exploración</span>
              <span className="ops-status-val standby">STANDBY</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Unidad minera</span>
              <span className="ops-status-val active">ACTIVA</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Reclutamiento</span>
              <span className="ops-status-val active">ABIERTO</span>
            </div>
          </div>

          <div className="sidebar-panel">
            <div className="sidebar-panel-title">Servidor de juego</div>
            <div className="ops-status-row">
              <span className="ops-status-label">Región</span>
              <span className="ops-status-val active">EU / ES</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Idioma</span>
              <span className="ops-status-val active">Español</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Rama PvP</span>
              <span className="ops-status-val active">SÍ</span>
            </div>
            <div className="ops-status-row">
              <span className="ops-status-label">Rama PvE</span>
              <span className="ops-status-val active">SÍ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CONTACTO / ÚNETE
────────────────────────────────────────────── */
function Contacto() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="section section-bg-alt" id="contacto">
      <p className="section-label">Reclutamiento</p>
      <h2 className="section-title">Únete a la corporación</h2>

      <div className="contact-layout">
        <div className="contact-info">
          <p className="contact-lead">
            La Corporación Dark Horizon acepta ciudadanos con ambición y disciplina.
            No importa tu especialización: combat, trade, mining o exploration. Si
            operas con lealtad y buscas una organización seria con voz hispana en
            el universo, tu sitio está aquí.
          </p>

          <div className="contact-channels">
            <a className="contact-channel" href="https://discord.gg" target="_blank" rel="noreferrer">
              <div className="contact-channel-icon">💬</div>
              <div className="contact-channel-text">
                <span className="contact-channel-name">Discord</span>
                <span className="contact-channel-sub">discord.gg/darkhorizon-cdh</span>
              </div>
            </a>
            <a className="contact-channel" href="https://robertsspaceindustries.com" target="_blank" rel="noreferrer">
              <div className="contact-channel-icon">🚀</div>
              <div className="contact-channel-text">
                <span className="contact-channel-name">RSI Organization</span>
                <span className="contact-channel-sub">robertsspaceindustries.com/orgs/CDH</span>
              </div>
            </a>
            <a className="contact-channel" href="https://twitch.tv" target="_blank" rel="noreferrer">
              <div className="contact-channel-icon">📡</div>
              <div className="contact-channel-text">
                <span className="contact-channel-name">Twitch / Streams</span>
                <span className="contact-channel-sub">twitch.tv/darkhorizoncdh</span>
              </div>
            </a>
          </div>
        </div>

        <div className="contact-form-wrap">
          <div className="join-form">
            <div className="join-form-title">Solicitud de ingreso</div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--cdh-neon)", marginBottom: "1rem" }}>
                  Solicitud enviada
                </div>
                <p style={{ color: "var(--cdh-text-dim)", fontSize: "0.95rem" }}>
                  Tu solicitud ha sido registrada. Un oficial de la CDH se pondrá en
                  contacto contigo en Discord en las próximas 48 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Handle RSI *</label>
                  <input className="form-input" placeholder="TuHandleEnStarCitizen" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Usuario de Discord</label>
                  <input className="form-input" placeholder="usuario#1234" />
                </div>
                <div className="form-group">
                  <label className="form-label">Especialización principal *</label>
                  <select className="form-select" required>
                    <option value="">Selecciona un rol</option>
                    <option>Combate — Piloto de caza</option>
                    <option>Combate — Artillero / Defensa</option>
                    <option>Transporte / Logística</option>
                    <option>Minería</option>
                    <option>Exploración / Reconocimiento</option>
                    <option>Médico / Soporte</option>
                    <option>Sin definir — aprendo todo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Presentación breve</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Cuéntanos sobre ti, cuánto llevas jugando y qué buscas en una org..."
                  />
                </div>
                <button className="form-submit" type="submit">
                  Enviar solicitud →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <div className="footer-logo">CORPORACIÓN DARK HORIZON</div>
        <div className="footer-copy">© 2954 CDH — Todos los sistemas</div>
      </div>
      <div className="footer-right">
        Star Citizen® es marca registrada de Cloud Imperium Games
        <br />
        Este sitio no está afiliado a CIG
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────
   APP PRINCIPAL
────────────────────────────────────────────── */
export default function App() {
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <StarField />
      <div className="scanlines" />
      <Navbar onNav={scrollToSection} />
      <main className="app-content">
        <Hero onNav={scrollToSection} />
        <div className="section-divider" />
        <Flota />
        <div className="section-divider" />
        <Eventos />
        <div className="section-divider" />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}