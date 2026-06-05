// ─────────────────────────────────────────────────────────────────────────────
//  Handler: interactionCreate
//  Handles button clicks → shows modal → logs the request
// ─────────────────────────────────────────────────────────────────────────────

const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require('discord.js');

const { log } = require('../utils/logger');
const { handleSetupCommand } = require('./setupCommand');

const BUTTON_ID  = 'request_update';
const MODAL_ID   = 'update_modal';
const INPUT_VER  = 'target_version';
const INPUT_NOTE = 'update_note';

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 */
async function handleInteraction(client, interaction) {
  // ── Slash command ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'setup') {
      return handleSetupCommand(interaction);
    }
    return;
  }

  // ── Button click: open modal ─────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId.startsWith(BUTTON_ID)) {
    const modal = new ModalBuilder()
      .setCustomId(`${MODAL_ID}:${interaction.channelId}`)
      .setTitle('Request a Plugin / Mod Update');

    const versionInput = new TextInputBuilder()
      .setCustomId(INPUT_VER)
      .setLabel('Target version  (e.g. 1.21.1)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('1.21.1')
      .setRequired(true)
      .setMaxLength(20);

    const noteInput = new TextInputBuilder()
      .setCustomId(INPUT_NOTE)
      .setLabel('Additional notes  (optional)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Any extra info for the developer...')
      .setRequired(false)
      .setMaxLength(500);

    modal.addComponents(
      new ActionRowBuilder().addComponents(versionInput),
      new ActionRowBuilder().addComponents(noteInput),
    );

    await interaction.showModal(modal);
    return;
  }

  // ── Modal submit ─────────────────────────────────────────────────────────
  if (interaction.isModalSubmit() && interaction.customId.startsWith(MODAL_ID)) {
    const threadId     = interaction.customId.split(':')[1];
    const targetVer    = interaction.fields.getTextInputValue(INPUT_VER).trim();
    const note         = interaction.fields.getTextInputValue(INPUT_NOTE).trim();
    const requester    = interaction.user;

    // Resolve thread / channel name for display
    let resourceName = 'Unknown Resource';
    try {
      const ch = await client.channels.fetch(threadId);
      if (ch) resourceName = ch.name;
    } catch (_) {}

    // ── Acknowledge to the user ──────────────────────────────────────────
    const ackEmbed = new EmbedBuilder()
      .setColor(0x8b0000)
      .setTitle('✅ Update Request Submitted')
      .setDescription(
        `Your request to update **${resourceName}** to version **\`${targetVer}\`** has been received.\n` +
        `The developer will review it as soon as possible.`
      )
      .setFooter({ text: 'Mythos Updater • by Chkaduuu' })
      .setTimestamp();

    if (note) ackEmbed.addFields({ name: 'Your notes', value: note });

    await interaction.reply({ embeds: [ackEmbed], ephemeral: true });

    // ── Log to log channel (if configured) ──────────────────────────────
    const logChannelId = process.env.LOG_CHANNEL_ID?.trim();
    if (logChannelId) {
      try {
        const logChannel = await client.channels.fetch(logChannelId);
        const notifyRole = process.env.NOTIFY_ROLE_ID?.trim();

        const logEmbed = new EmbedBuilder()
          .setColor(0xff4444)
          .setTitle('📦 New Update Request')
          .addFields(
            { name: 'Resource',        value: resourceName,                         inline: true },
            { name: 'Target Version',  value: `\`${targetVer}\``,                   inline: true },
            { name: 'Requested by',    value: `<@${requester.id}> (${requester.tag})`, inline: false },
            { name: 'Thread',          value: `<#${threadId}>`,                      inline: true },
          )
          .setFooter({ text: 'Mythos Updater v1.9.1' })
          .setTimestamp();

        if (note) logEmbed.addFields({ name: 'Notes', value: note });

        const content = notifyRole ? `<@&${notifyRole}>` : undefined;
        await logChannel.send({ content, embeds: [logEmbed] });
      } catch (err) {
        log('error', `[interaction] Failed to send log: ${err.message}`);
      }
    }

    log('info', `[interaction] Update request: "${resourceName}" → v${targetVer} by ${requester.tag}`);
  }
}

module.exports = { handleInteraction };