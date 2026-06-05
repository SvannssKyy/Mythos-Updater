# Mythos Updater  `v1.9.1`

> Discord bot for **Mythos SMP** — automatically posts update-request buttons in forum threads.
> **Author:** Chkaduuu

---

## What it does

When a new post is created in any of the watched forum channels (`⚙│Plugins`, `🔧│Mods`, `📜│Scripts`), the bot instantly joins the thread and posts an embed with a red **"Request Update for Version X.X.X"** button.

Any server member can click the button, fill in the target Minecraft version (and optional notes), and the request is:
- Confirmed to the user via an ephemeral reply.
- Logged to a designated log channel (with optional role ping).

---

## Setup

### 1. Create a Discord Application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → name it `Mythos Updater`
3. Go to **Bot** → **Reset Token** → copy the token

### 2. Enable Intents

In the Bot page, enable:
- ✅ **Server Members Intent**
- ✅ **Message Content Intent**

### 3. Invite the bot

Use this OAuth2 URL (replace `CLIENT_ID`):
```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&permissions=277025770560&scope=bot%20applications.commands
```

Required permissions: **Send Messages**, **Read Message History**, **View Channels**, **Use Slash Commands**, **Embed Links**.

### 4. Configure `.env`

```bash
cp .env.example .env
```

Fill in all values:

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from Developer Portal |
| `GUILD_ID` | Right-click your server → Copy Server ID |
| `FORUM_CHANNEL_IDS` | Comma-separated IDs of your forum channels |
| `LOG_CHANNEL_ID` | *(optional)* Channel where requests are logged |
| `NOTIFY_ROLE_ID` | *(optional)* Role to ping on new request |

### 5. Run

```bash
npm install
npm start
```

Or in development with auto-restart:
```bash
npm run dev
```

---

## How to find Channel IDs

1. Enable Developer Mode: Discord Settings → Advanced → Developer Mode ✅
2. Right-click the forum channel → **Copy Channel ID**

---

## Project structure

```
mythos-updater/
├── src/
│   ├── index.js                  # Entry point, client setup
│   ├── handlers/
│   │   ├── threadCreate.js       # Watches for new forum posts
│   │   └── interaction.js        # Handles button + modal
│   └── utils/
│       ├── messageBuilder.js     # Embed & button factory
│       └── logger.js             # Console logger
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Flow diagram

```
New forum post created
        │
        ▼
Bot detects threadCreate event
        │
        ├─ Parent channel in FORUM_CHANNEL_IDS? ──No──► ignore
        │
        ▼  Yes
Bot sends embed + "Request Update" button
        │
        ▼
Member clicks button
        │
        ▼
Modal opens (target version + notes)
        │
        ▼
Member submits
        │
        ├─► Ephemeral confirmation to member
        └─► Log embed sent to LOG_CHANNEL_ID (+ role ping if set)
```

---

*Mythos Updater v1.9.1 — built for Mythos SMP*
