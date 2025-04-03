const {Client,Interaction, PermissionsBitField ,SlashCommandBuilder} = require('discord.js');

module.exports = {
  run: async ({interaction, handler}) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({content: 'Apenas administradores do servidor podem executar este comando', ephemeral: true})
      return;
   }    
   if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    interaction.reply({content: 'Eu não tenho permissões para banir membros', ephemeral: true})
    return;
 }    
   if (!interaction.inGuild()) {
    interaction.reply({
      content: "Você só pode executar este comando em um servidor.",
      ephemeral: true,
    });
   return;
  }
    const targetUserId = interaction.options.get('user')
    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("Esse usuário não existe neste servidor.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Você não pode banir esse usuário porque ele é dono seu burro."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "Você não pode banir esse usuário porque ele tem o mesmo/maior cargo que você."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "Eu não posso banir esse usuário porque ele tem o mesmo poder que eu né seu IDIOTA?."
      );
      return;
    }

    try {
      await targetUser.ban();
      await interaction.editReply(
        `O usuário ${targetUser} foi banido KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },

  data: new SlashCommandBuilder()
  .setName('ban')
  .setDescription("Bane um usuário.")
  .addUserOption((option) => option
  .setName('user')
  .setDescription('O usuário que você quer banir')
  .setRequired(true)),
  permissionsRequired: [PermissionsBitField.Flags.BanMembers],
  botPermissions: [PermissionsBitField.Flags.BanMembers],
  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};