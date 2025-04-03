const {Client,Interaction,ApplicationCommandOptionType,AttachmentBuilder,SlashCommandBuilder,} = require('discord.js');
const User = require('../../models/User');

module.exports = {
  run: async ({client, interaction}) => {
    if (!interaction.inGuild()) {
      interaction.reply('Você só pode executar este comando dentro de um servidor.');
      return;
    }
    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;
 
    await interaction.deferReply();

    const user = await User.findOne({ userId: targetUserId });


    if (!user) {
      interaction.editReply(`<@${targetUserId}> não tem dinheiro.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
      ? `Seu saldo é **${user.balance}**`
      : `O saldo de <@${targetUserId}> é **${user.balance}**`
      );
  },
  data: new SlashCommandBuilder()
  .setName('balance')
  .setDescription("Verifique seu ou o saldo de outro usuário")
  .addUserOption((option) => option
  .setName('user')
  .setDescription('Quem você quer ver o saldo')),
  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};