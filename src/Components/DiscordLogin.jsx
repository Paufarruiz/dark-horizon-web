import { useAuth, ROLES } from "../Context/AuthContext";

// Avatar de Discord: si no tiene, muestra iniciales
function Avatar({ user, size = 40 }) {
  const initials = user.username?.slice(0, 2).toUpperCase() || "??";
  if (user.avatar) {
    return (
      <img
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
        alt={user.username}
        style={{ width: size, height: size, borderRadius: "50%", border: "2px solid var(--gold)" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--card)", border: "2px solid var(--gold)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--gold)"
    }}>
      {initials}
    </div>
  );
}

export default function DiscordLogin() {
  const { user, loading, login, logout, getUserRole } = useAuth();
  const role = getUserRole();

  if (loading) {
    return (
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.65rem",
        letterSpacing: "0.15em", color: "var(--muted)", padding: "0.5rem 1rem"
      }}>
        AUTENTICANDO...
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Badge de rango */}
        {role && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: role.color, border: `1px solid ${role.color}`,
            padding: "0.2rem 0.6rem", opacity: 0.9
          }}>
            {role.label}
          </span>
        )}

        <Avatar user={user} size={36} />

        <span style={{
          fontFamily: "var(--font-body)", fontSize: "0.85rem",
          fontWeight: 600, color: "var(--white)", maxWidth: 120,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>
          {user.username}
        </span>

        <button
          onClick={logout}
          style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "var(--muted)", background: "none",
            border: "1px solid var(--border)", padding: "0.3rem 0.7rem",
            cursor: "pointer", transition: "color 0.2s, border-color 0.2s"
          }}
          onMouseEnter={e => { e.target.style.color = "var(--gold)"; e.target.style.borderColor = "var(--gold)"; }}
          onMouseLeave={e => { e.target.style.color = "var(--muted)"; e.target.style.borderColor = "var(--border)"; }}
        >
          SALIR
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="btn btn-outline"
      style={{ gap: "0.5rem", padding: "0.6rem 1.2rem", fontSize: "0.75rem" }}
    >
      {/* Logo Discord SVG inline */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
      Login con Discord
    </button>
  );
}