import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../Context/AuthContext";

const BACKEND  = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const UEX_BASE = `${BACKEND}/api/uex`;

// Sistemas con sus IDs en UEX
const SISTEMAS = [
  { label: "Todos",   value: "all" },
  { label: "Stanton", value: 1 },
  { label: "Pyro",    value: 2 },
];

// LISTA AMPLIADA: Añadimos más IDs para capturar absolutamente TODOS los minerales y mercancías nuevos
const COMMODITY_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  70, 71, 72, 73, 74, 75, 76, 77, 78, 80,
  85, 90, 91, 92, 93, 94, 95, 99, 100
];

function fmt(n) {
  if (!n && n !== 0) return "—";
  return Math.round(n).toLocaleString("es-ES");
}

function ScoreBar({ score }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 14,
          background: i < (score || 0) ? "var(--gold)" : "var(--border)",
        }} />
      ))}
    </div>
  );
}

function RouteRow({ r, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setOpen(o => !o)}
        style={{
          cursor: "pointer",
          background: open
            ? "rgba(200,151,58,0.06)"
            : idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
          borderBottom: "1px solid var(--border)",
          transition: "background 0.15s",
        }}
      >
        <td style={{ padding: "0.85rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
          {String(idx + 1).padStart(2, "0")}
        </td>
        <td style={{ padding: "0.85rem 0.5rem" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--white)" }}>{r.commodity_name}</div>
          <div style={{ fontSize: "0.62rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{r.commodity_code}</div>
        </td>
        <td style={{ padding: "0.85rem 0.5rem" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600 }}>{r.origin_terminal_name}</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
            {r.origin_star_system_name} · {r.origin_planet_name || r.origin_orbit_name}
          </div>
        </td>
        <td style={{ padding: "0.85rem 0.5rem" }}>
          <div style={{ fontSize: "0.78rem", color: "#51cf66", fontWeight: 600 }}>{r.destination_terminal_name}</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
            {r.destination_star_system_name} · {r.destination_planet_name || r.destination_orbit_name}
          </div>
        </td>
        <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--gold)", fontWeight: 700 }}>
            {fmt(r.profit)} aUEC
          </div>
          <div style={{ fontSize: "0.63rem", color: "var(--muted)" }}>{fmt(r.price_margin)}/SCU</div>
        </td>
        <td style={{ padding: "0.85rem 1rem" }}>
          <ScoreBar score={r.score} />
        </td>
        <td style={{ padding: "0.85rem 1rem", textAlign: "center", color: "var(--muted)", fontSize: "0.75rem" }}>
          {open ? "▲" : "▼"}
        </td>
      </tr>

      {open && (
        <tr style={{ background: "rgba(200,151,58,0.04)", borderBottom: "1px solid var(--border)" }}>
          <td colSpan={7} style={{ padding: "1.2rem 2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: "1rem" }}>
              {[
                { label: "Precio compra",  val: `${fmt(r.price_origin)} aUEC/SCU` },
                { label: "Precio venta",   val: `${fmt(r.price_destination)} aUEC/SCU` },
                { label: "Margen/SCU",     val: `${fmt(r.price_margin)} aUEC` },
                { label: "Stock origen",   val: `${fmt(r.scu_origin)} SCU` },
                { label: "Stock destino",  val: `${fmt(r.scu_destination)} SCU` },
                { label: "Inversión máx.", val: `${fmt(r.investment)} aUEC` },
                { label: "Distancia",      val: r.distance ? `${Number(r.distance).toFixed(1)} GM` : "—" },
                { label: "ROI",            val: r.price_roi ? `${Number(r.price_roi).toFixed(1)}%` : "—" },
              ].map(({ label, val }) => (
                <div key={label} style={{ borderLeft: "2px solid var(--border)", paddingLeft: "0.75rem" }}>
                  <div style={{ fontSize: "0.58rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--white)", fontFamily: "var(--font-mono)" }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <a
                href={`https://uexcorp.space/trade/route?code=${r.code}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: "0.7rem", color: "var(--gold)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}
              >
                VER EN UEX CORP →
              </a>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RutasComerciales() {
  const { user, hasMinLevel, login } = useAuth();

  const [allRoutes, setAllRoutes]   = useState([]);   // datos crudos
  const [routes,    setRoutes]      = useState([]);   // datos filtrados
  const [loading,   setLoading]     = useState(false);
  const [progress,  setProgress]    = useState(0);
  const [error,     setError]       = useState(null);
  const [lastUpdate,setLastUpdate]  = useState(null);

  // Filtros
  const [filterSysOri,  setFilterSysOri]  = useState("all");
  const [filterSysDest, setFilterSysDest] = useState("all");
  const [filterCom,     setFilterCom]     = useState("");
  const [sortBy,        setSortBy]        = useState("profit");
  const [showIllegal,   setShowIllegal]   = useState(false);

  // Filtro de mercancía inteligente generado automáticamente por useMemo para evitar duplicados
  const commodityList = useMemo(() => {
    const comMap = {};
    allRoutes.forEach(r => { if (r.commodity_name) comMap[r.commodity_name] = true; });
    return Object.keys(comMap).sort();
  }, [allRoutes]);

  // Carga todas las rutas
  const fetchAllRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setAllRoutes([]);

    try {
      const seen   = new Set();
      const result = [];

      // SE CORRIGE AQUÍ: Quitamos el .slice(0, 15) para que lea TODO el array de mercancías extendido
      const requests = [
        `${UEX_BASE}/commodities_routes?id_star_system_origin=1`,
        `${UEX_BASE}/commodities_routes?id_star_system_origin=2`,
        `${UEX_BASE}/commodities_routes?id_star_system_destination=1`,
        `${UEX_BASE}/commodities_routes?id_star_system_destination=2`,
        ...COMMODITY_IDS.map(id => `${UEX_BASE}/commodities_routes?id_commodity=${id}`),
      ];

      for (let i = 0; i < requests.length; i++) {
        try {
          const res  = await fetch(requests[i]);
          const data = await res.json();
          if (data.status === "ok" && Array.isArray(data.data)) {
            data.data.forEach(r => {
              const key = `${r.id_terminal_origin}-${r.id_terminal_destination}-${r.id_commodity}`;
              if (!seen.has(key)) {
                seen.add(key);
                result.push(r);
              }
            });
          }
        } catch {}
        setProgress(Math.round(((i + 1) / requests.length) * 100));
      }

      setAllRoutes(result);
      setLastUpdate(new Date());

    } catch (e) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }, []);

  // Aplicar filtros sobre allRoutes
  useEffect(() => {
    let rows = [...allRoutes];

    if (filterSysOri !== "all")
      rows = rows.filter(r => Number(r.id_star_system_origin) === Number(filterSysOri));

    if (filterSysDest !== "all")
      rows = rows.filter(r => Number(r.id_star_system_destination) === Number(filterSysDest));

    if (filterCom)
      rows = rows.filter(r => r.commodity_name === filterCom);

    if (!showIllegal)
      rows = rows.filter(r => !r.commodity_slug?.toLowerCase().includes("illegal"));

    rows.sort((a, b) => {
      if (sortBy === "profit") return (b.profit || 0) - (a.profit || 0);
      if (sortBy === "margin") return (b.price_margin || 0) - (a.price_margin || 0);
      if (sortBy === "score")  return (b.score  || 0) - (a.score  || 0);
      return 0;
    });

    // Subimos el renderizado a 250 elementos para que quepan todos los nuevos minerales cargados
    setRoutes(rows.slice(0, 250));
  }, [allRoutes, filterSysOri, filterSysDest, filterCom, sortBy, showIllegal]);

  // Cargar al montar
  useEffect(() => {
    if (user && hasMinLevel(4)) fetchAllRoutes();
  }, [user, fetchAllRoutes]);

  // ── Sin login ────────────────────────────────────────────────
  if (!user) return (
    <div className="page">
      <section style={{ padding: "6rem 3rem", textAlign: "center" }}>
        <span className="section-tag">Zona Restringida</span>
        <h1 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "1.5rem" }}>
          Acceso <span>Denegado</span>
        </h1>
        <div className="gold-line" style={{ margin: "1.5rem auto" }} />
        <p style={{ color: "var(--muted)", marginBottom: "2rem", maxWidth: 480, margin: "0 auto 2rem" }}>
          Las rutas comerciales son información clasificada. Identifícate con Discord para continuar.
        </p>
        <button className="btn btn-primary" onClick={login}>Login con Discord</button>
      </section>
    </div>
  );

  // ── Nivel insuficiente ───────────────────────────────────────
  if (!hasMinLevel(4)) return (
    <div className="page">
      <section style={{ padding: "6rem 3rem", textAlign: "center" }}>
        <span className="section-tag">Nivel 4+ requerido</span>
        <h1 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "1.5rem" }}>
          Rango <span>insuficiente</span>
        </h1>
        <div className="gold-line" style={{ margin: "1.5rem auto" }} />
        <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto" }}>
          Disponible a partir de <strong style={{ color: "var(--gold)" }}>Ojeador de Brecha</strong>. Contacta con un superior.
        </p>
      </section>
    </div>
  );

  return (
    <div className="page">
      <section style={{ padding: "3rem 2rem 5rem", maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <span className="section-tag">Inteligencia Comercial · UEX Corp · LIVE</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem,4vw,3rem)", marginBottom: "0.5rem" }}>
            Rutas <span>Comerciales</span>
          </h1>
          <div className="gold-line" />
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <span>Datos en tiempo real · UEX Corp API · Solo nivel 4+</span>
            {lastUpdate && (
              <span style={{ color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                ◆ ÚLTIMA SYNC {lastUpdate.toLocaleTimeString("es-ES")}
              </span>
            )}
            {allRoutes.length > 0 && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
                {allRoutes.length} rutas cargadas
              </span>
            )}
          </p>
        </div>

        {/* Mapa SVG */}
        <div style={{
          marginBottom: "1.5rem", padding: "1.25rem 1.5rem",
          border: "1px solid var(--border)", background: "rgba(13,17,32,0.4)",
        }}>
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Mapa de Sistemas · Zona de Operaciones
          </div>
          <svg viewBox="0 0 800 160" style={{ width: "100%", height: "auto", maxHeight: 140 }}>
            {[...Array(25)].map((_, i) => (
              <circle key={i}
                cx={(Math.sin(i * 137.5) * 0.5 + 0.5) * 800}
                cy={(Math.cos(i * 97.3) * 0.5 + 0.5) * 160}
                r={i % 3 === 0 ? 1.2 : 0.7} fill="rgba(255,255,255,0.25)" />
            ))}
            <line x1="260" y1="80" x2="540" y2="80" stroke="rgba(200,151,58,0.3)" strokeWidth="1" strokeDasharray="6,4" />
            <text x="400" y="72" textAnchor="middle" fill="rgba(200,151,58,0.5)" fontSize="8" fontFamily="monospace">JUMP POINT</text>

            {/* Stanton */}
            <circle cx="190" cy="80" r="42"
              fill={filterSysOri === 1 || filterSysDest === 1 ? "rgba(200,151,58,0.1)" : "rgba(200,151,58,0.04)"}
              stroke={filterSysOri === 1 || filterSysDest === 1 ? "var(--gold)" : "rgba(200,151,58,0.35)"}
              strokeWidth="1.5" />
            <circle cx="190" cy="80" r="5" fill="var(--gold)" opacity={filterSysOri === 1 || filterSysDest === 1 ? 1 : 0.4} />
            <circle cx="190" cy="47" r="3" fill="rgba(200,151,58,0.5)" />
            <circle cx="222" cy="68" r="3" fill="rgba(200,151,58,0.5)" />
            <circle cx="218" cy="100" r="3" fill="rgba(200,151,58,0.5)" />
            <circle cx="158" cy="100" r="3" fill="rgba(200,151,58,0.5)" />
            <text x="190" y="135" textAnchor="middle" fill="var(--gold)" fontSize="10" fontFamily="monospace" fontWeight="bold">STANTON</text>

            {/* Pyro */}
            <circle cx="610" cy="80" r="42"
              fill={filterSysOri === 2 || filterSysDest === 2 ? "rgba(231,76,60,0.1)" : "rgba(231,76,60,0.04)"}
              stroke={filterSysOri === 2 || filterSysDest === 2 ? "#ff6b6b" : "rgba(231,76,60,0.35)"}
              strokeWidth="1.5" />
            <circle cx="610" cy="80" r="5" fill="#ff6b6b" opacity={filterSysOri === 2 || filterSysDest === 2 ? 1 : 0.4} />
            <circle cx="610" cy="47" r="2.5" fill="rgba(231,76,60,0.5)" />
            <circle cx="640" cy="68" r="2.5" fill="rgba(231,76,60,0.5)" />
            <circle cx="580" cy="105" r="2.5" fill="rgba(231,76,60,0.5)" />
            <text x="610" y="135" textAnchor="middle" fill="#ff6b6b" fontSize="10" fontFamily="monospace" fontWeight="bold">PYRO</text>

            {/* Nyx */}
            <circle cx="400" cy="35" r="14" fill="rgba(127,191,255,0.04)" stroke="rgba(127,191,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="400" cy="35" r="3" fill="rgba(127,191,255,0.35)" />
            <text x="400" y="18" textAnchor="middle" fill="rgba(127,191,255,0.4)" fontSize="8" fontFamily="monospace">NYX</text>
          </svg>
        </div>

        {/* Filtros */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem",
          padding: "1.25rem 1.5rem", border: "1px solid var(--border)",
          background: "rgba(13,17,32,0.6)", backdropFilter: "blur(8px)",
          alignItems: "flex-end",
        }}>
          {[
            {
              label: "Ordenar por", key: "sort",
              val: sortBy, set: setSortBy,
              opts: [
                { v: "profit", l: "Mayor beneficio total" },
                { v: "margin", l: "Mayor beneficio/SCU" },
                { v: "score",  l: "Mayor score UEX" },
              ]
            },
          ].map(f => (
            <div key={f.key} style={{ flex: "1 1 170px" }}>
              <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                {f.label}
              </label>
              <select className="form-select" value={f.val} onChange={e => f.set(e.target.value)} style={{ width: "100%", fontSize: "0.8rem" }}>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}

          {/* Filtro mercancía */}
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Mercancía
            </label>
            <select className="form-select" value={filterCom} onChange={e => setFilterCom(e.target.value)} style={{ width: "100%", fontSize: "0.8rem" }}>
              <option value="">Todas</option>
              {commodityList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Toggle ilegales */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", paddingBottom: "0.1rem" }}>
            <label style={{ fontSize: "0.72rem", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={showIllegal} onChange={e => setShowIllegal(e.target.checked)}
                style={{ accentColor: "var(--gold)", width: 14, height: 14 }} />
              Mostrar ilegales
            </label>
          </div>

          {/* Botón */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btn-primary" onClick={fetchAllRoutes} disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, fontSize: "0.78rem", padding: "0.6rem 1.4rem", whiteSpace: "nowrap" }}>
              {loading ? `${progress}%...` : "⟳ RECARGAR"}
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        {loading && (
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                SINCRONIZANDO CON UEX CORP...
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--gold)" }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: 2, background: "var(--border)", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${progress}%`, background: "var(--gold)", transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "1rem 1.5rem", border: "1px solid rgba(231,76,60,0.4)", color: "#ff6b6b", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
            ⚠ {error}
          </div>
        )}

        {/* Tabla */}
        {!loading && routes.length > 0 ? (
          <div style={{ border: "1px solid var(--border)", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ background: "rgba(200,151,58,0.08)", borderBottom: "1px solid var(--border)" }}>
                  {["#", "Mercancía", "Origen · Compra", "Destino · Venta", "Beneficio", "Score UEX", ""].map(h => (
                    <th key={h} style={{
                      padding: "0.75rem 1rem", textAlign: h === "Beneficio" ? "right" : "left",
                      fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "var(--muted)", fontWeight: 400, whiteSpace: "nowrap"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <RouteRow 
                    key={`${r.id_terminal_origin}-${r.id_terminal_destination}-${r.id_commodity}`} 
                    r={r} 
                    idx={i} 
                  />
                ))}
              </tbody>
            </table>
            <div style={{
              padding: "0.6rem 1.5rem", borderTop: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem",
              background: "rgba(13,17,32,0.4)"
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>
                {routes.length} RUTAS · DATOS: UEX CORP API v2.0
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--gold)" }}>
                ◆ CLASIFICADO · NIVEL 4+
              </span>
            </div>
          </div>
        ) : !loading && (
          <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--border)", color: "var(--muted)", fontSize: "0.85rem" }}>
            {allRoutes.length === 0 ? "Pulsa RECARGAR para cargar las rutas." : "No hay rutas con los filtros actuales."}
          </div>
        )}

      </section>
    </div>
  );
}