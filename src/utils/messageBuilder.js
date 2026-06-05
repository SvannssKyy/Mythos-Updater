// ─────────────────────────────────────────────────────────────────────────────
//  Utility: messageBuilder
//  Builds the embed + button row posted in each new forum thread.
// ─────────────────────────────────────────────────────────────────────────────

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Returns the category label based on the parent channel name.
 * @param {import('discord.js').ThreadChannel} thread
 */
function getCategoryLabel(thread) {
  const parent = thread.parent;
  if (!parent) return 'Resource';
  const name = parent.name.toLowerCase();
  if (name.includes('plugin')) return 'Plugin';
  if (name.includes('mod'))    return 'Mod';
  if (name.includes('script')) return 'Script';
  return 'Resource';
}

/**
 * Builds the embed for the update-request message.
 * @param {import('discord.js').ThreadChannel} thread
 * @returns {EmbedBuilder}
 */
function buildUpdateEmbed(thread) {
  const label = getCategoryLabel(thread);

  return new EmbedBuilder()
    .setColor(0x8b0000) // dark red — Mythos brand
    .setTitle(`📬 Request a ${label} Update`)
    .setDescription(
      `Want this **${label.toLowerCase()}** updated to a newer Minecraft version?\n\n` +
      `Click the button below, enter the target version, and the request will be forwarded to **Chkaduuu** automatically.\n\n` +
      `> ⚠️ Requests are reviewed manually — please be patient.`
    )
    .setFooter({ text: `Mythos Updater v1.9.1 • by Chkaduuu` })
    .setTimestamp();
}

/**
 * Builds the action row with the "Request Update" button.
 * @param {string} threadId
 * @returns {ActionRowBuilder}
 */
function buildUpdateRow(threadId) {
  const btn = new ButtonBuilder()
    .setCustomId(`request_update:${threadId}`)
    .setLabel('🔄  Request Update for Version X.X.X')
    .setStyle(ButtonStyle.Danger); // red — matches the dark theme

  return new ActionRowBuilder().addComponents(btn);
}

module.exports = { buildUpdateEmbed, buildUpdateRow };
