const LINKS = [
  { id: "hero",     label: "Inicio"   },
  { id: "flota",    label: "Flota"    },
  { id: "contacto", label: "Unirse"   },
];

export default function Footer({ navigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__logo">⬡ DARK HORIZON LOGISTICS</div>

      <ul className="footer__links">
        {LINKS.map(l => (
          <li key={l.id}>
            <span className="footer__link" onClick={() => navigate(l.id)}>
              {l.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="footer__copy">
        © {year} Dark Horizon Logistics · Star Citizen Organization
      </p>
      <p className="footer__disclaimer">
        Dark Horizon Logistics es una organización de jugadores de Star Citizen. No afiliada con Cloud Imperium Games.
        Star Citizen® es marca registrada de Cloud Imperium Rights LLC.
      </p>
    </footer>
  );
}