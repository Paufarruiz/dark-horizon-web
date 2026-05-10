import { useEffect, useState } from "react";
import { MI_FLOTA_CLAN } from "../Data/FlotaData";

export default function Flota() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullShipData = async () => {
      setLoading(true);
      try {
        const shipNames = MI_FLOTA_CLAN.map(ship => ship.name);
        const apiUrl = `https://starcitizen.tools/api.php?action=query&prop=pageimages|extracts&exintro&explaintext&pithumbsize=1000&titles=${encodeURIComponent(shipNames.join('|'))}&format=json&origin=*`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        const pages = data.query?.pages || {};
        const dataMap = {};
        Object.values(pages).forEach(page => {
          dataMap[page.title.toLowerCase()] = {
            img: page.thumbnail?.source,
            desc: page.extract ? page.extract.split('.')[0] + '.' : "Ficha técnica disponible en la Wiki."
          };
        });
        const joinedData = MI_FLOTA_CLAN.map((naveClan, index) => {
          const lowerName = naveClan.name.toLowerCase();
          const info = dataMap[lowerName] || 
                       dataMap[Object.keys(dataMap).find(k => k.includes(lowerName) || lowerName.includes(k))] || {};
          return {
            id: index,
            owner: naveClan.owner,
            name: naveClan.name,
            img: info.img || "https://starcitizen.tools/images/0/03/Aurora_MR_in_space.jpg",
            desc: info.desc || "Sincronizando con los servidores de la UEE..."
          };
        });
        setShips(joinedData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullShipData();
  }, []);

  return (
    <div style={styles.page}>
      {/* ESTO ES LO QUE ARREGLA EL MÓVIL SÍ O SÍ */}
      <style>{`
        .contenedor-grid-dhl {
          display: grid !important;
          gap: 20px !important;
          width: 100% !important;
          grid-template-columns: 1fr !important; /* MÓVIL POR DEFECTO */
        }

        @media (min-width: 768px) {
          .contenedor-grid-dhl {
            grid-template-columns: repeat(2, 1fr) !important; /* TABLET */
          }
        }

        @media (min-width: 1100px) {
          .contenedor-grid-dhl {
            grid-template-columns: repeat(4, 1fr) !important; /* PC */
          }
        }
      `}</style>

      <section style={styles.section}>
        <header style={styles.header}>
          <span style={styles.tag}>Sincronización RSI Online</span>
          <h1 style={styles.title}>NUESTRA <span style={styles.gold}>FLOTA</span></h1>
          <div style={styles.line} />
        </header>

        {loading ? (
          <div style={styles.loading}>ACCEDIENDO AL MANIFIESTO DE CARGA...</div>
        ) : (
          <div className="contenedor-grid-dhl">
            {ships.map((ship) => (
              <div key={ship.id} style={styles.card}>
                <div style={styles.imageContainer}>
                  <img 
                    src={ship.img} 
                    alt={ship.name}
                    style={styles.img}
                    onError={(e) => { e.target.src = "https://starcitizen.tools/images/0/03/Aurora_MR_in_space.jpg"; }}
                  />
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.shipName}>{ship.name}</h3>
                  <div style={styles.shipOwner}>PILOTO: {ship.owner}</div>
                  <p style={styles.shipDesc}>{ship.desc}</p>
                  <div style={styles.footer}>
                    <div style={styles.status}>SISTEMAS ONLINE</div>
                    <a 
                      href={`https://starcitizen.tools/${ship.name.replace(/ /g, '_')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={styles.wikiLink}
                    >
                      INFO +
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: { width: "100%", minHeight: "100vh", padding: "2rem 1rem", boxSizing: "border-box" },
  section: { width: "100%", margin: "0 auto" },
  header: { marginBottom: "2rem", paddingLeft: "1rem" },
  tag: { color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "2px", textTransform: "uppercase" },
  title: { color: "var(--white)", fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "0.5rem 0", fontFamily: "var(--font-display)", textTransform: "uppercase" },
  gold: { color: "var(--gold)" },
  line: { width: "100px", height: "2px", background: "var(--gold)" },
  loading: { color: "var(--gold)", fontFamily: "var(--font-mono)", textAlign: "center", padding: "4rem", width: "100%" },
  card: { background: "rgba(10, 15, 25, 0.95)", border: "1px solid rgba(255, 215, 0, 0.15)", display: "flex", flexDirection: "column", overflow: "hidden" },
  imageContainer: { width: "100%", aspectRatio: "16/9", background: "#000", overflow: "hidden" },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cardBody: { padding: "1.2rem", display: "flex", flexDirection: "column", flexGrow: 1 },
  shipName: { color: "var(--white)", fontSize: "1.2rem", margin: "0", fontFamily: "var(--font-display)" },
  shipOwner: { color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", margin: "5px 0 15px 0" },
  shipDesc: { color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", lineHeight: "1.4", margin: "0 0 20px 0", borderLeft: "2px solid var(--gold)", paddingLeft: "10px" },
  footer: { marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)" },
  status: { color: "var(--cyan)", fontSize: "0.6rem", fontFamily: "var(--font-mono)" },
  wikiLink: { color: "var(--gold)", textDecoration: "none", fontSize: "0.7rem", fontWeight: "bold", border: "1px solid var(--gold)", padding: "2px 8px" }
};