// ─────────────────────────────────────────────────────────────────────────────
//  Handler: threadCreate
//  Fires when a new thread (forum post) is created.
//  Sends an auto-message with the "Request Update" button.
// ─────────────────────────────────────────────────────────────────────────────

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
} = require('discord.js');

const { log }            = require('../utils/logger');
const { buildUpdateEmbed, buildUpdateRow } = require('../utils/messageBuilder');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ThreadChannel} thread
 * @param {boolean} newlyCreated
 */
async function handleThreadCreate(client, thread, newlyCreated) {
  // Only react to brand-new threads
  if (!newlyCreated) return;

  // Only react to threads inside forum channels
  if (thread.type !== ChannelType.PublicThread) return;

  // Check if the parent channel is one we're watching
  const watchedIds = process.env.FORUM_CHANNEL_IDS.split(',').map((s) => s.trim());
  if (!watchedIds.includes(thread.parentId)) return;

  // Small delay so the OP message is visible first
  await sleep(1500);

  try {
    const embed = buildUpdateEmbed(thread);
    const row   = buildUpdateRow(thread.id);

    await thread.send({ embeds: [embed], components: [row] });
    log('info', `[threadCreate] Posted update-request button in thread "${thread.name}" (${thread.id})`);
  } catch (err) {
    log('error', `[threadCreate] Failed to post in thread ${thread.id}: ${err.message}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { handleThreadCreate };
