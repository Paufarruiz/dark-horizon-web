import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../Context/AuthContext";

// API con datos reales del juego (speed, shields, cargo, crew, weapons...)
const SC_WIKI_API = "https://api.star-citizen.wiki/api/vehicles";

// ── Stats que mostramos en tabla ──────────────────────────────────────────────
const STAT_GROUPS = [
  {
    label: "CARGA & LOGÍSTICA",
    icon: "◈",
    stats: [
      { key: "cargo_capacity", label: "Capacidad SCU",     unit: "SCU",  highlight: true },
      { key: "crew_min",       label: "Tripulación Mín.",  unit: "pers" },
      { key: "crew_max",       label: "Tripulación Máx.",  unit: "pers" },
      { key: "mass",           label: "Masa",              unit: "kg",   lowerIsBetter: true },
    ],
  },
  {
    label: "VELOCIDAD & MANIOBRA",
    icon: "◆",
    stats: [
      { key: "speed_scm",       label: "Velocidad SCM",     unit: "m/s",  highlight: true },
      { key: "speed_max",       label: "Velocidad Máx.",    unit: "m/s" },
      { key: "boost_forward",   label: "Afterburner",       unit: "m/s" },
      { key: "agility_pitch",   label: "Pitch (agilidad)",  unit: "°/s" },
      { key: "agility_yaw",     label: "Yaw (agilidad)",    unit: "°/s" },
    ],
  },
  {
    label: "BLINDAJE & COMBATE",
    icon: "◉",
    stats: [
      { key: "shield_hp",       label: "HP Escudos",        unit: "HP",   highlight: true },
      { key: "hull_hp",         label: "HP Casco",          unit: "HP" },
      { key: "pilot_dps",       label: "DPS Piloto",        unit: "DPS" },
      { key: "missile_damage",  label: "Daño Misiles",      unit: "HP" },
    ],
  },
  {
    label: "PROPULSIÓN",
    icon: "◇",
    stats: [
      { key: "fuel_capacity",   label: "Combustible",       unit: "L",    highlight: true },
      { key: "quantum_speed",   label: "Velocidad Quantum", unit: "Gm/s" },
      { key: "quantum_range",   label: "Rango Quantum",     unit: "Gm" },
      { key: "quantum_fuel",    label: "Fuel Quantum",      unit: "L" },
    ],
  },
];

// ── Axes del gráfico radar ────────────────────────────────────────────────────
const RADAR_AXES = [
  { key: "cargo_capacity", label: "CARGA",       max: 5000 },
  { key: "speed_scm",      label: "VELOCIDAD",   max: 600  },
  { key: "shield_hp",      label: "ESCUDOS",     max: 80000},
  { key: "pilot_dps",      label: "COMBATE",     max: 10000},
  { key: "agility_pitch",  label: "AGILIDAD",    max: 120  },
  { key: "crew_max",       label: "TRIPULACIÓN", max: 16   },
];

const SHIP_COLORS = ["#00d4ff", "#c8973a", "#7b9fff"];

function fmt(val, unit) {
  if (val === null || val === undefined || val === 0) return "—";
  if (unit === "Gm/s") return (val / 1000000).toFixed(1) + " Gm/s";
  if (unit === "Gm")   return (val / 1000000000).toFixed(0) + " Gm";
  if (typeof val === "number") return val.toLocaleString("es-ES") + (unit ? ` ${unit}` : "");
  return String(val);
}

// Normaliza un valor entre 0 y 1
function normalize(val, max) {
  if (!val || !max) return 0;
  return Math.min(val / max, 1);
}

// ── Mapea la respuesta de la API a un objeto plano de stats ──────────────────
function mapShipData(raw) {
  return {
    id:             raw.uuid,
    name:           raw.name,
    manufacturer:   raw.manufacturer?.name || "—",
    img:            null, // se carga aparte de la wiki SC Tools
    cargo_capacity: raw.cargo_capacity || 0,
    crew_min:       raw.crew?.min || 0,
    crew_max:       raw.crew?.max || 0,
    mass:           Math.round(raw.mass || 0),
    speed_scm:      raw.speed?.scm || 0,
    speed_max:      raw.speed?.max || 0,
    boost_forward:  raw.speed?.boost_forward || 0,
    agility_pitch:  raw.agility?.pitch || 0,
    agility_yaw:    raw.agility?.yaw || 0,
    shield_hp:      raw.shield_hp || raw.shield?.hp || 0,
    hull_hp:        raw.health || 0,
    pilot_dps:      raw.weaponry?.pilot_dps || 0,
    missile_damage: raw.weaponry?.missiles?.damage?.total || raw.weaponry?.total_missile_damage || 0,
    fuel_capacity:  raw.fuel?.capacity ? raw.fuel.capacity * 1000 : 0,
    quantum_speed:  raw.quantum?.quantum_speed || 0,
    quantum_range:  raw.quantum?.quantum_range || 0,
    quantum_fuel:   raw.quantum?.quantum_fuel_capacity ? raw.quantum.quantum_fuel_capacity * 1000 : 0,
  };
}

// ── Gráfico radar SVG puro ────────────────────────────────────────────────────
function RadarChart({ ships }) {
  const N     = RADAR_AXES.length;
  const CX    = 200;
  const CY    = 200;
  const R     = 150;
  const rings = [0.25, 0.5, 0.75, 1];

  // Calcula el punto en el polígono para eje i, valor normalizado v
  const pt = (i, v) => {
    const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
    return {
      x: CX + R * v * Math.cos(angle),
      y: CY + R * v * Math.sin(angle),
    };
  };

  const axisEndpoints = RADAR_AXES.map((_, i) => pt(i, 1));
  const labelPoints   = RADAR_AXES.map((_, i) => pt(i, 1.22));

  const polygonPoints = (ship) =>
    RADAR_AXES.map((ax, i) => {
      const v = normalize(ship[ax.key], ax.max);
      return pt(i, v);
    });

  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  const ringPath = (frac) =>
    RADAR_AXES.map((_, i) => {
      const p = pt(i, frac);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <div className="comp-radar-wrap">
      <div className="comp-radar-title">PERFIL TÁCTICO</div>
      <svg viewBox="0 0 400 400" className="comp-radar-svg">
        {/* Rings */}
        {rings.map(r => (
          <path key={r} d={ringPath(r)} fill="none"
            stroke="rgba(26,34,64,0.8)" strokeWidth="1" />
        ))}
        {/* Axes */}
        {axisEndpoints.map((ep, i) => (
          <line key={i} x1={CX} y1={CY} x2={ep.x} y2={ep.y}
            stroke="rgba(26,34,64,0.6)" strokeWidth="1" />
        ))}
        {/* Labels */}
        {RADAR_AXES.map((ax, i) => (
          <text key={i} x={labelPoints[i].x} y={labelPoints[i].y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10" fill="var(--muted)"
            fontFamily="var(--font-mono)" letterSpacing="1">
            {ax.label}
          </text>
        ))}
        {/* Ship polygons */}
        {ships.map((ship, si) => {
          if (!ship) return null;
          const pts  = polygonPoints(ship);
          const dots = RADAR_AXES.map((ax, i) => {
            const v = normalize(ship[ax.key], ax.max);
            return pt(i, v);
          });
          return (
            <g key={ship.id || si}>
              <path d={toPath(pts)}
                fill={SHIP_COLORS[si]} fillOpacity="0.12"
                stroke={SHIP_COLORS[si]} strokeWidth="1.5" />
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="3"
                  fill={SHIP_COLORS[si]} opacity="0.9" />
              ))}
            </g>
          );
        })}
      </svg>
      {/* Leyenda */}
      <div className="comp-radar-legend">
        {ships.map((ship, si) => ship ? (
          <div key={si} className="comp-radar-legend-item">
            <span className="comp-radar-dot" style={{ background: SHIP_COLORS[si] }} />
            <span className="comp-radar-legend-name">{ship.name}</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}

// ── Selector de nave ──────────────────────────────────────────────────────────
function ShipSelector({ slot, allShips, selected, onSelect, onClear, loading }) {
  const [query, setQuery] = useState("");
  const [open,  setOpen]  = useState(false);

  const filtered = allShips.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 40);

  return (
    <div className="comp-slot">
      {selected ? (
        <div className="comp-slot-filled">
          <button className="comp-slot-clear" onClick={onClear} title="Quitar nave">✕</button>
          <div className="comp-slot-img-wrap">
            <img
              src={selected.img || "https://starcitizen.tools/images/0/03/Aurora_MR_in_space.jpg"}
              alt={selected.name}
              className="comp-slot-img"
              onError={e => { e.target.src = "https://starcitizen.tools/images/0/03/Aurora_MR_in_space.jpg"; }}
            />
          </div>
          <div className="comp-slot-info">
            <div className="comp-slot-manufacturer">{selected.manufacturer}</div>
            <div className="comp-slot-name">{selected.name}</div>
            <div className="comp-slot-scu">
              {selected.cargo_capacity > 0 ? `${selected.cargo_capacity} SCU` : "—"}
              {selected.speed_scm > 0 ? ` · ${selected.speed_scm} m/s SCM` : ""}
            </div>
          </div>
        </div>
      ) : (
        <div className="comp-slot-empty">
          <div className="comp-slot-number">NAVE {slot}</div>
          <div className="comp-slot-search-wrap">
            <input
              className="comp-search-input"
              placeholder={loading ? "Cargando..." : "Buscar cualquier nave..."}
              value={query}
              disabled={loading}
              onChange={e => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
            />
            <span className="comp-search-icon">⌕</span>
          </div>
          {open && filtered.length > 0 && (
            <ul className="comp-dropdown">
              {filtered.map(s => (
                <li key={s.uuid} className="comp-dropdown-item"
                  onMouseDown={() => { onSelect(s); setQuery(""); setOpen(false); }}>
                  <span className="comp-dd-name">{s.name}</span>
                  <span className="comp-dd-scu" style={{ color: "var(--muted)", fontSize: "0.65rem" }}>
                    {s.manufacturer?.name || ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {open && !loading && filtered.length === 0 && query && (
            <div className="comp-dropdown-empty">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ComparadorNaves() {
  const { user, hasMinLevel, login } = useAuth();

  const [allShips,  setAllShips]  = useState([]);
  const [selected,  setSelected]  = useState([null, null, null]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  // Carga la lista completa de naves (solo nombre + manufacturer para el selector)
  const fetchShipList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pages = [];
      // La API devuelve paginado, cargamos hasta 25 páginas (~500 naves)
      let page = 1;
      while (page <= 25) {
        const res  = await fetch(`${SC_WIKI_API}?limit=25&page=${page}`);
        const data = await res.json();
        if (!data?.data?.length) break;
        pages.push(...data.data);
        if (!data.meta?.last_page || page >= data.meta.last_page) break;
        page++;
      }
      setAllShips(pages.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError("No se pudo cargar el catálogo de naves.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && hasMinLevel(2)) fetchShipList();
  }, [user, fetchShipList]);

  // Cuando el usuario elige una nave, cargamos stats completos + imagen de la wiki
  const handleSelect = async (idx, rawShip) => {
    // Ponemos la nave inmediatamente sin imagen para feedback rápido
    const basic = mapShipData(rawShip);
    setSelected(prev => prev.map((s, i) => i === idx ? basic : s));

    // Cargamos stats detallados e imagen en paralelo
    const [statsRes, imgRes] = await Promise.allSettled([
      fetch(`${SC_WIKI_API}/${rawShip.slug || rawShip.uuid}`),
      fetch(`https://starcitizen.tools/api.php?action=query&prop=pageimages&pithumbsize=800&titles=${encodeURIComponent(rawShip.name)}&format=json&origin=*`),
    ]);

    let full = basic;

    // Stats
    if (statsRes.status === "fulfilled") {
      try {
        const data = await statsRes.value.json();
        full = mapShipData(data.data || data);
      } catch {}
    }

    // Imagen de la wiki
    if (imgRes.status === "fulfilled") {
      try {
        const imgData = await imgRes.value.json();
        const pages   = imgData.query?.pages || {};
        const page    = Object.values(pages)[0];
        if (page?.thumbnail?.source) {
          full = { ...full, img: page.thumbnail.source };
        }
      } catch {}
    }

    setSelected(prev => prev.map((s, i) => i === idx ? full : s));
  };

  const handleClear = (idx) =>
    setSelected(prev => prev.map((s, i) => i === idx ? null : s));

  const activeShips = selected.filter(Boolean);

  function getBest(key, lowerIsBetter = false) {
    const vals = selected.filter(Boolean).map(s => s?.[key]).filter(v => v > 0);
    if (vals.length < 2) return null;
    return lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
  }

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="page-container">
        <div className="comp-access-denied">
          <div className="comp-denied-icon">◈</div>
          <h2 className="comp-denied-title">ACCESO RESTRINGIDO</h2>
          <p className="comp-denied-msg">
            El Comparador de Naves es una herramienta interna de{" "}
            <span className="gold">Dark Horizon Logistics</span>.<br/>
            Inicia sesión con Discord para continuar.
          </p>
          <button className="comp-denied-btn" onClick={login}>
            <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Conectar con Discord
          </button>
        </div>
      </div>
    );
  }

  if (!hasMinLevel(2)) {
    return (
      <div className="page-container">
        <div className="comp-access-denied">
          <div className="comp-denied-icon" style={{ color: "var(--muted)" }}>⊘</div>
          <h2 className="comp-denied-title" style={{ color: "var(--muted)" }}>CLEARANCE INSUFICIENTE</h2>
          <p className="comp-denied-msg">
            Esta herramienta requiere rango <span className="gold">Nivel 2</span> o superior.<br/>
            Contacta con el staff de <span style={{ color: "var(--cyan)" }}>Dark Horizon Logistics</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <section className="comp-section">
        <header className="flota-header">
          <span className="flota-tag">Herramienta Táctica · Nivel 2+</span>
          <h1 className="flota-title">COMPARADOR DE <span className="gold">NAVES</span></h1>
          <div className="flota-line" />
          <p className="comp-subtitle">
            Selecciona hasta <span className="gold">3 naves</span> de todo el universo Star Citizen.
            El valor <span className="comp-badge-preview">▲ mejor</span> se resalta automáticamente.
          </p>
        </header>

        {error && <div className="comp-error"><span>⚠</span> {error}</div>}

        {/* Selectores */}
        <div className="comp-selectors">
          {[0, 1, 2].map(i => (
            <ShipSelector
              key={i}
              slot={i + 1}
              allShips={allShips}
              selected={selected[i]}
              onSelect={ship => handleSelect(i, ship)}
              onClear={() => handleClear(i)}
              loading={loading}
            />
          ))}
        </div>

        {loading && (
          <div className="flota-loading">ACCEDIENDO AL REGISTRO DE NAVES...</div>
        )}

        {/* Gráfico radar + tabla */}
        {activeShips.length >= 1 && !loading && (
          <>
            {/* Radar */}
            <RadarChart ships={selected} />

            {/* Tabla */}
            <div className="comp-table-wrap">
              {STAT_GROUPS.map(group => (
                <div key={group.label} className="comp-group">
                  <div className="comp-group-header">
                    <span className="comp-group-icon">{group.icon}</span>
                    {group.label}
                  </div>
                  <div className="comp-table">
                    {/* Cabecera */}
                    <div className="comp-row comp-row-header">
                      <div className="comp-cell comp-cell-label">PARÁMETRO</div>
                      {selected.map((ship, i) => (
                        <div key={i} className={`comp-cell comp-cell-ship ${!ship ? "comp-cell-empty" : ""}`}
                          style={{ color: ship ? SHIP_COLORS[i] : undefined }}>
                          {ship ? ship.name : "— VACÍO —"}
                        </div>
                      ))}
                    </div>
                    {/* Filas */}
                    {group.stats.map(stat => {
                      const best = getBest(stat.key, stat.lowerIsBetter || false);
                      return (
                        <div key={stat.key} className={`comp-row ${stat.highlight ? "comp-row-highlight" : ""}`}>
                          <div className="comp-cell comp-cell-label">{stat.label}</div>
                          {selected.map((ship, i) => {
                            const val    = ship?.[stat.key];
                            const isBest = best !== null && val === best && activeShips.length >= 2;
                            return (
                              <div key={i} className={`comp-cell comp-cell-val ${!ship ? "comp-cell-empty" : ""} ${isBest ? "comp-cell-best" : ""}`}>
                                {ship ? fmt(val, stat.unit) : "—"}
                                {isBest && <span className="comp-best-badge">▲</span>}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeShips.length === 0 && !loading && (
          <div className="comp-placeholder">
            <div className="comp-placeholder-icon">◈</div>
            <div className="comp-placeholder-text">Selecciona al menos una nave para iniciar la comparativa</div>
          </div>
        )}
      </section>
    </div>
  );
}