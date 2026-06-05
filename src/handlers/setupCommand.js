// ─────────────────────────────────────────────────────────────────────────────
//  Handler: /setup command
//  Posts the update-request button in an existing thread.
// ─────────────────────────────────────────────────────────────────────────────

const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { buildUpdateEmbed, buildUpdateRow } = require('../utils/messageBuilder');
const { log } = require('../utils/logger');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function handleSetupCommand(interaction) {
  const channel = interaction.channel;

  // Must be used inside a thread
  if (channel.type !== ChannelType.PublicThread && channel.type !== ChannelType.PrivateThread) {
    return interaction.reply({
      content: '❌ This command must be used **inside a thread** (forum post).',
      ephemeral: true,
    });
  }

  // Only allow admins / moderators
  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({
      content: '❌ You need the **Manage Messages** permission to use this command.',
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const embed = buildUpdateEmbed(channel);
    const row   = buildUpdateRow(channel.id);

    await channel.send({ embeds: [embed], components: [row] });

    await interaction.editReply({ content: '✅ Update request button posted!' });
    log('info', `[/setup] Button posted in thread "${channel.name}" by ${interaction.user.tag}`);
  } catch (err) {
    log('error', `[/setup] Failed: ${err.message}`);
    await interaction.editReply({ content: '❌ Something went wrong. Check bot permissions.' });
  }
}

module.exports = { handleSetupCommand };