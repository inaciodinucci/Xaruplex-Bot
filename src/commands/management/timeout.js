const { Client, Interaction, SlashCommandBuilder ,PermissionsBitField} = require('discord.js');
const ms = require('ms');

module.exports = {
  run: async ({client, interaction}) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode executar este comando em um servidor.",
        ephemeral: true,
      });
     return;
    }
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      interaction.reply({content: 'Apenas administradores do servidor podem executar este comando.', ephemeral: true})
      return;
   }    
  if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    interaction.reply({content: 'Eu não tenho permissões para timeoutar membros.', ephemeral: true})
    return;
 }  
    const mentionable = interaction.options.get('user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("Esse usuário não existe neste servidor.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Eu não posso timeoutar um bot.");
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply('Por favor, forneça uma duração de timeout válida.');
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply('A duração do timeout não pode ser menor que 5 segundos ou maior que 28 dias.');
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("Você não pode timeoutar esse usuário porque ele tem o mesmo poder que você.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("Eu não posso timeoutar esse usuário porque ele tem o mesmo poder que eu.");
      return;
    }

    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration);
        await interaction.editReply(`O timeout de ${targetUser} foi atualizado para ${prettyMs(msDuration, { verbose: true })}`);
        return;
      }

      await targetUser.timeout(msDuration);
      await interaction.editReply(`${targetUser} foi timeoutado por ${prettyMs(msDuration, { verbose: true })}.`);
    } catch (error) {
      console.log(`Houve um erro ao timeoutar: ${error}`);
    }
  },

  data: new SlashCommandBuilder()
  .setName('timeout')
  .setDescription("Timeouta um usuário.")
  .addMentionableOption(option =>
    option.setName('user')
    .setDescription('O usuário que você quer timeoutar')
    .setRequired(true))
    .addStringOption(option => option
      .setName('duration')
      .setDescription('A duração do timeout 5m, 20s, 1 day')
      .setRequired(true)
    ),

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};