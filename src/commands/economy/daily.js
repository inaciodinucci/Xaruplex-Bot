const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 100;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Resgate seu prêmio diário'),

  run: async ({ client, interaction }) => {
    try {
      // Ensure the command is used in a guild
      if (!interaction.inGuild()) {
        return interaction.reply({
          content: "Você só pode executar este comando em um servidor.",
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const userId = interaction.user.id;

      let user = await User.findOne({ userId });

      // Check if the user exists in the database
      if (!user) {
        user = new User({
          userId: interaction.user.id,
          balance: 0,
          lastDaily: new Date(),
        });
      } else {
        // Check if the user has already claimed their daily reward
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          return interaction.editReply("Você já resgatou seu prêmio diário hoje.");
        }
      }

      // Add the daily amount to the user's balance and update lastDaily
      user.balance += dailyAmount;
      user.lastDaily = new Date();
      await user.save();

      // Send a success message with the new balance
      return interaction.editReply(`${dailyAmount} foi adicionado ao seu saldo. Seu novo saldo é ${user.balance}`);
    } catch (error) {
      console.error('Erro com o comando diário:', error);
      return interaction.editReply({ content: 'Ocorreu um erro ao processar sua solicitação.', ephemeral: true });
    }
  },
};
