// ─────────────────────────────────────────────────────────────────────────────
//  Mythos Updater  v1.9.1
//  Author : Chkaduuu
//  Purpose: Auto-post update-request buttons in forum threads
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { handleThreadCreate }  = require('./handlers/threadCreate');
const { handleInteraction }   = require('./handlers/interaction');
const { log }                 = require('./utils/logger');

// ── Validate required env vars ───────────────────────────────────────────────
const required = ['DISCORD_TOKEN', 'GUILD_ID', 'FORUM_CHANNEL_IDS'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[Mythos Updater] Missing required env var: ${key}`);
    process.exit(1);
  }
}

// ── Create client ────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// ── Events ───────────────────────────────────────────────────────────────────
client.once('ready', () => {
  log('info', `Logged in as ${client.user.tag} — Mythos Updater v1.9.1 ready`);
  client.user.setPresence({
    activities: [{ name: 'Mythos SMP | Watching plugins' }],
    status: 'online',
  });
});

client.on('threadCreate', (thread, newlyCreated) =>
  handleThreadCreate(client, thread, newlyCreated)
);

client.on('interactionCreate', (interaction) =>
  handleInteraction(client, interaction)
);

client.on('error', (err) => log('error', `Client error: ${err.message}`));

// ── Login ────────────────────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
