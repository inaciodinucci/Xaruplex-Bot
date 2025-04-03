const {Client,Interaction,SlashCommandBuilder,PermissionFlagsBits,PermissionsBitField} = require('discord.js');

module.exports = {
  run: async ({client, interaction}) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({content: 'Apenas administradores do servidor podem executar este comando.', ephemeral: true})
      return;
   }    
   if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    interaction.reply({content: 'Eu não tenho permissões para expulsar membros.', ephemeral: true})
    return;
 }    
   if (!interaction.inGuild()) {
    interaction.reply({
      content: "Você só pode executar este comando em um servidor.",
      ephemeral: true,
    });
   return;
  }
    const targetUserId = interaction.options.get('user').value;
    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Esse usuário não existe neste servidor.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Você não pode expulsar esse usuário porque ele é o DONO NE PORRA."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Você não pode expulsar esse usuário porque ele tem o mesmo tantão de lixo que você."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Eu não posso expulsar esse usuário porque ele tem o mesmo tantão de lixo que eu."
      );
      return;
    }

    try {
      await targetUser.kick();
      await interaction.editReply(
        `O usuário ${targetUser} foi expulso KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK`
      );
    } catch (error) {
      console.log(`Houve um erro ao expulsar: ${error}`);
    }
  },
  data: new SlashCommandBuilder()
  .setName('kick')
  .setDescription("Expulsa um usuário")
  .addUserOption(option =>
    option.setName('user')
    .setDescription('O usuário que você quer expulso')
    .setRequired(true)),
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};