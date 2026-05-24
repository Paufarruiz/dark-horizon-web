import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ─── Roles del servidor Dark Horizon Logistics (nuevo servidor) ───────────────
export const ROLES = {
  CONSORCIO_FANTASMA:       { id: "1507884518986481778", label: "Consorcio Fantasma",        color: "#c8973a", level: 7 },
  CUPULA_OPERATIVA:         { id: "1507884776265355374", label: "Cúpula Operativa",           color: "#f700ff", level: 6 },
  DIRECTOR_DIVISION:        { id: "1507885020126384280", label: "Director de División",       color: "#ff6b6b", level: 5 },
  MAESTRE_FLOTA:            { id: "1507885100250169445", label: "Maestre de Flota",           color: "#ff8c42", level: 5 },
  OJEADOR_BRECHA:           { id: "1507884877691752468", label: "Ojeador de Brecha",          color: "#7b9fff", level: 4 },
  AGENTE_CONTRAINFORMACION: { id: "1507884969626828870", label: "Agente Contrainformación",   color: "#9b59b6", level: 4 },
  OFICIAL_ABORDAJE:         { id: "1507885495764516864", label: "Oficial de Abordaje",        color: "#00d4ff", level: 3 },
  EFECTIVO_CHOQUE:          { id: "1507885709132959744", label: "Efectivo de Choque",         color: "#e74c3c", level: 3 },
  PERSONAL_CONTRATACION:    { id: "1507885969788112966", label: "Personal de Contratación",   color: "#1abc9c", level: 3 },
  ENLACE_DIPLOMATICO:       { id: "1507886160553447584", label: "Enlace Diplomático",         color: "#3498db", level: 3 },
  SOCIO_COMERCIAL:          { id: "1507886263410233425", label: "Socio Comercial",            color: "#2ecc71", level: 2 },
  PERSONAL_CIVIL:           { id: "1507886380452155452", label: "Personal Civil",             color: "#95a5a6", level: 2 },
  PILOTO_COMBATE:           { id: "1507892829706387648", label: "Piloto de Combate",          color: "#e74c3c", level: 2 },
  OP_INDUSTRIAL:            { id: "1507892872937083010", label: "Operaciones Industriales",   color: "#f39c12", level: 2 },
  OP_INFANTERIA:            { id: "1507893107230769192", label: "Operaciones de Infantería",  color: "#c0392b", level: 2 },
  DIPLOMACIA:               { id: "1507893334427832451", label: "Diplomacia",                 color: "#2980b9", level: 2 },
  ASPIRANTE:                { id: "1507893563415859403", label: "Aspirante",                  color: "#bdc3c7", level: 1 },
  EN_CUARENTENA:            { id: "1507894822965481542", label: "En Cuarentena",              color: "#e74c3c", level: 0 },
};

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("dhl_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("code");
    if (code) {
      handleDiscordCallback(code);
    } else {
      setLoading(false);
    }
  }, []);

  const handleDiscordCallback = async (code) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const res  = await fetch(`${BACKEND_URL}/auth/discord/callback`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        sessionStorage.setItem("dhl_user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Error en callback Discord:", err);
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoading(false);
    }
  };

  const login = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    window.location.href = `${BACKEND_URL}/auth/discord`;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("dhl_user");
  };

  // Rol más alto del usuario
  const getUserRole = () => {
    if (!user?.roles) return null;
    const sorted = Object.values(ROLES).sort((a, b) => b.level - a.level);
    for (const role of sorted) {
      if (user.roles.includes(role.id)) return role;
    }
    return null;
  };

  // Todos los roles activos del usuario
  const getUserRoles = () => {
    if (!user?.roles) return [];
    return Object.values(ROLES).filter(r => user.roles.includes(r.id));
  };

  const hasMinLevel  = (level) => { const r = getUserRole(); return r ? r.level >= level : false; };
  const isMember     = () => { const r = getUserRole(); return r ? r.level >= 1 : false; };
  const isStaff      = () => hasMinLevel(5);
  const isLeadership = () => hasMinLevel(6);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout,
      getUserRole, getUserRoles,
      hasMinLevel, isMember, isStaff, isLeadership,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);