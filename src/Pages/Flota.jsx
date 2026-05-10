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
    <div className="page-container">
      <section className="flota-section">
        <header className="flota-header">
          <span className="flota-tag">Sincronización RSI Online</span>
          <h1 className="flota-title">NUESTRA <span className="gold">FLOTA</span></h1>
          <div className="flota-line" />
        </header>

        {loading ? (
          <div className="flota-loading">ACCEDIENDO AL MANIFIESTO DE CARGA...</div>
        ) : (
          /* Clase mágica para el responsivo automático */
          <div className="contenedor-grid-auto">
            {ships.map((ship) => (
              <div key={ship.id} className="ship-card-dhl">
                <div className="ship-image-container">
                  <img 
                    src={ship.img} 
                    alt={ship.name}
                    className="ship-img"
                    onError={(e) => { e.target.src = "https://starcitizen.tools/images/0/03/Aurora_MR_in_space.jpg"; }}
                  />
                </div>
                <div className="ship-card-body">
                  <h3 className="ship-name-text">{ship.name}</h3>
                  <div className="ship-owner-text">PILOTO: {ship.owner}</div>
                  <p className="ship-desc-text">{ship.desc}</p>
                  <div className="ship-card-footer">
                    <div className="ship-status">SISTEMAS ONLINE</div>
                    <a 
                      href={`https://starcitizen.tools/${ship.name.replace(/ /g, '_')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="ship-wiki-link"
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