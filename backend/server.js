// backend/server.js — Dark Horizon Logistics Auth Backend
import express  from "express";
import cors     from "cors";
import fetch    from "node-fetch";
import "dotenv/config";

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Auth Discord ─────────────────────────────────────────────

app.get("/auth/discord", (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.DISCORD_CLIENT_ID,
    redirect_uri:  process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope:         "identify guilds.members.read",
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

app.post("/auth/discord/callback", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
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

    const userRes  = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = await userRes.json();

    const memberRes  = await fetch(
      `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const memberData = await memberRes.json();

    const user = {
      id:       userData.id,
      username: userData.global_name || userData.username,
      avatar:   userData.avatar,
      roles:    memberData.roles || [],
      nickname: memberData.nick || userData.global_name || userData.username,
    };

    res.json({ user });
  } catch (err) {
    console.error("Error OAuth:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// ── Proxy UEX Corp API (evita CORS del navegador) ────────────
// El frontend llama a /api/uex/commodities_routes?...
// El backend lo reenvía a UEX y devuelve la respuesta
app.get("/api/uex/:resource", async (req, res) => {
  const { resource } = req.params;
  const query        = new URLSearchParams(req.query).toString();
  const uexUrl       = `https://api.uexcorp.space/2.0/${resource}${query ? "?" + query : ""}`;

  try {
    const uexRes  = await fetch(uexUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "DarkHorizonLogistics/1.0",
      },
    });
    const data = await uexRes.json();
    res.json(data);
  } catch (err) {
    console.error("Error proxy UEX:", err);
    res.status(500).json({ status: "error", message: "No se pudo conectar con UEX Corp" });
  }
});

// ── Health ───────────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "online", clan: "Dark Horizon Logistics" })
);

app.listen(PORT, () =>
  console.log(`🚀 DHL Auth Backend · puerto ${PORT}`)
);