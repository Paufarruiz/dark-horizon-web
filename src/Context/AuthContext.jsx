import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ─── Roles reales del servidor Dark Horizon Logistics ────────────────────────
export const ROLES = {
  CUERPO_DIRECTIVO: {
    id:    "1002859327335440474",
    label: "Cuerpo Directivo",
    color: "#c8973a",
    level: 5,
  },
  SUPERVISOR: {
    id:    "1002857406939791420",
    label: "Supervisor",
    color: "#e8b44a",
    level: 4,
  },
  RRHH: {
    id:    "1008111309298077768",
    label: "RRHH",
    color: "#00d4ff",
    level: 3,
  },
  DPTO_ESTADO: {
    id:    "1457017520056701030",
    label: "Dpto. Estado",
    color: "#7b9fff",
    level: 2,
  },
  DPTO_DEFENSA: {
    id:    "1464532975562526800",
    label: "Dpto. Defensa",
    color: "#ff6b6b",
    level: 2,
  },
  DPTO_TRANSPORTE: {
    id:    "1457044737763573924",
    label: "Dpto. Transporte",
    color: "#51cf66",
    level: 2,
  },
  CIUDADANO: {
    id:    "1008016169355186216",
    label: "Ciudadano",
    color: "#a0b0c0",
    level: 1,
  },
  TRABAJADOR: {
    id:    "1008019478837211186",
    label: "Trabajador",
    color: "#8a9bb0",
    level: 1,
  },
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

  // Todos los roles activos (un usuario puede tener Ciudadano + Dpto. Defensa a la vez)
  const getUserRoles = () => {
    if (!user?.roles) return [];
    return Object.values(ROLES).filter(r => user.roles.includes(r.id));
  };

  const hasMinLevel = (level) => {
    const role = getUserRole();
    return role ? role.level >= level : false;
  };

  const isMember  = () => getUserRole() !== null;
  const isStaff   = () => hasMinLevel(4);  // Supervisor o Cuerpo Directivo

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout,
      getUserRole, getUserRoles,
      hasMinLevel, isMember, isStaff,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);