import { useEffect, useRef, useState } from "react";

export default function Eventos({ navigate }) {
  const [eventosApollo, setEventosApollo] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeRefs = useRef([]);

  useEffect(() => {
    const fetchApolloEvents = async () => {
      setLoading(true);
      try {
        const guildId = "1002849633598447647";
        // Usamos un proxy gratuito para evitar que el navegador bloquee la conexión
        const proxy = "https://api.allorigins.win/get?url=";
        const target = encodeURIComponent(`https://apollo.fyi/api/v1/guilds/${guildId}/events`);
        
        const res = await fetch(`${proxy}${target}`);
        const json = await res.json();
        
        // Apollo devuelve los datos dentro de 'contents' cuando usamos el proxy
        const data = JSON.parse(json.contents);

        if (data && data.length > 0) {
          const mapeados = data.map(ev => {
            const fecha = new Date(ev.start_time);
            return {
              id: ev.id,
              day: fecha.getDate(),
              month: fecha.toLocaleString('es-ES', { month: 'short' }).toUpperCase(),
              type: "OPERACIÓN OFICIAL",
              title: ev.title,
              desc: ev.description?.replace(/[*_~]/g, '') || "Sin descripción disponible.",
              location: ev.location || "Sector Discord",
              members: ev.attendee_counts?.accepted || "0",
              featured: true
            };
          });
          setEventosApollo(mapeados);
        } else {
          setEventosApollo([]);
        }
      } catch (error) {
        console.error("Error conectando con Apollo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApolloEvents();

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  return (
    <div className="page">
      <section className="eventos">
        <div className="eventos__content">
          <header className="eventos__header fade-in" ref={addRef}>
            <span className="section-tag">Log de Operaciones · DHL Bot</span>
            <h1 className="section-title"><span>Eventos</span> en Vivo</h1>
            <div className="gold-line" />
          </header>

          <div className="eventos__layout">
            <div className="eventos__list">
              {loading ? (
                <p style={{color: "var(--gold)", fontFamily: "var(--font-mono)"}}>SINCRONIZANDO CON APOLLO...</p>
              ) : eventosApollo.length > 0 ? (
                eventosApollo.map((ev) => (
                  <div key={ev.id} className="evento-card visible featured">
                    <div className="evento-card__date">
                      <span className="evento-card__date-day">{ev.day}</span>
                      <span className="evento-card__date-month">{ev.month}</span>
                    </div>
                    <div>
                      <div className="evento-card__type" style={{color: "var(--gold)"}}>MISIÓN DE CLAN</div>
                      <h3 className="evento-card__title">{ev.title}</h3>
                      <p className="evento-card__desc">{ev.desc}</p>
                      <div className="evento-card__meta" style={{marginTop: "1.5rem", display: "flex", gap: "20px"}}>
                        <span style={{fontSize: "0.8rem", color: "var(--muted)"}}>📍 {ev.location}</span>
                        <span style={{fontSize: "0.8rem", color: "var(--gold)"}}>👥 {ev.members} Confirmados</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="evento-card visible" style={{ border: "1px dashed rgba(200,151,58,0.4)", textAlign: "center", padding: "4rem" }}>
                  <h3 style={{ color: "var(--white)", marginBottom: "1rem" }}>SIN OPERACIONES</h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    No hay eventos en Apollo. Mueve tu evento de <strong>Drafts</strong> a <strong>Scheduled</strong> en el panel de Apollo.
                  </p>
                </div>
              )}
            </div>
            
            <aside className="eventos__sidebar fade-in" ref={addRef}>
               <div className="sidebar-block">
                <h3 className="sidebar-block__title">Apollo Intel</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  Misiones extraídas del bot de flota. Crea eventos en el canal #operaciones.
                </p>
                <a href="https://discord.gg/BPd4aNDwuF" target="_blank" className="btn btn-primary" style={{marginTop: "1rem", width: "100%", justifyContent: "center"}}>DISCORD</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}