// backend/server.js — Dark Horizon Logistics Auth Backend
import express  from "express";
import cors     from "cors";
import fetch    from "node-fetch";
import "dotenv/config";

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// PASO 1 — Redirigir al usuario a Discord OAuth2
app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.DISCORD_CLIENT_ID,
    redirect_uri:  process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope:         "identify guilds.members.read",
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// PASO 2 — Recibir el código y obtener datos del usuario
app.post("/auth/discord/callback", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Intercambiar código por access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id:     process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    "authorization_code",
        code,
        redirect_uri:  process.env.DISCORD_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token recibido");

    const { access_token } = tokenData;

    // Datos básicos del usuario
    const userRes  = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = await userRes.json();

    // Roles del usuario en el servidor de Dark Horizon (ID: 1002849633598447647)
    const memberRes  = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const memberData = await memberRes.json();

    const user = {
      id:       userData.id,
      username: userData.global_name || userData.username,
      avatar:   userData.avatar,
      roles:    memberData.roles || [],       // Array de IDs de roles en el servidor
      nickname: memberData.nick || userData.global_name || userData.username,
    };

    res.json({ user });

  } catch (err) {
    console.error("Error OAuth:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/health", (_req, res) =>
  res.json({ status: "online", clan: "Dark Horizon Logistics" })
);

app.listen(PORT, () =>
  console.log(`🚀 DHL Auth Backend · puerto ${PORT}`)
);