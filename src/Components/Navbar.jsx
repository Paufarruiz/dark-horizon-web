import { useState, useEffect } from "react";
import DiscordLogin from "./DiscordLogin";

const LINKS = [
  { id: "hero",     label: "Inicio"   },
  { id: "flota",    label: "Flota"    },
  { id: "contacto", label: "Unirse"   },
];

export default function Navbar({ current, navigate }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <div className="navbar__logo" onClick={() => go("hero")}>
          <svg className="navbar__logo-icon" viewBox="0 0 36 36" fill="none">
            <polygon points="18,2 34,30 2,30" stroke="#c8973a" strokeWidth="1.5" fill="none"/>
            <polygon points="18,10 28,28 8,28"  fill="#c8973a" opacity="0.15"/>
            <circle  cx="18" cy="18" r="3" fill="#c8973a"/>
            <line x1="18" y1="2"  x2="18" y2="34" stroke="#c8973a" strokeWidth="0.5" opacity="0.4"/>
          </svg>
          <span className="navbar__logo-text">DHL</span>
        </div>

        {/* Desktop links */}
        <ul className="navbar__links">
          {LINKS.map(l => (
            <li key={l.id}>
              <span
                className={`navbar__link${current === l.id ? " active" : ""}`}
                onClick={() => go(l.id)}
              >
                {l.label}
              </span>
            </li>
          ))}
        </ul>

        {/* 🔑 Login Discord — solo en desktop */}
        <div className="navbar__auth">
          <DiscordLogin />
        </div>

        {/* Burger mobile */}
        <div className="navbar__burger" onClick={() => setMobileOpen(o => !o)}>
          <span style={{ transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </div>
      </nav>

      {/* Mobile menu */}
      <ul className={`navbar__mobile${mobileOpen ? " open" : ""}`}>
        {LINKS.map(l => (
          <li key={l.id}>
            <span
              className={`navbar__link${current === l.id ? " active" : ""}`}
              onClick={() => go(l.id)}
            >
              {l.label}
            </span>
          </li>
        ))}
        {/* Login también en menú móvil */}
        <li style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
          <DiscordLogin />
        </li>
      </ul>
    </>
  );
}