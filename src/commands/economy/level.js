const {Client,Interaction,AttachmentBuilder,SlashCommandBuilder,} = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const GuildSettings = require('../../models/GuildSettings');


module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  run: async ({client, interaction}) => {
    if (!interaction.inGuild()) {
      interaction.reply('Você só pode executar este comando em um servidor.');
      return;
    }
    const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if(!guildSettings) return interaction.reply({
      content: "O leveling não está habilitado neste servidor. Habilite-o com **\`/level-setting\`**",
      ephemeral: true,
    });
    if(guildSettings.levels === false) return interaction.reply({
      content: "O leveling não está habilitado neste servidor. Habilite-o com **\`/level-setting\`**",
      ephemeral: true,
    });

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} não tem nenhum nível ainda. Tente novamente quando eles conversarem um pouco mais.`
          : "Você não tem nenhum nível ainda. Converse um pouco mais e tente novamente."
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      '-_id userId level xp'
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
    const rank = new canvacord.Rank()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setProgressBar('#20B2AA', 'COLOR')
      .setBackground('COLOR', "#214854")
      .setOverlay('#367588', 0.5, true)
      .setStatus('online')
      .setUsername(`@${targetUserObj.user.username}`);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },

  data: new SlashCommandBuilder()
  .setName('level')
  .setDescription("Verifique seu ou o nível de outro usuário")
  .addUserOption((option) => option
  .setName('user')
  .setDescription('O nível do usuário que você quer ver')),
  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};