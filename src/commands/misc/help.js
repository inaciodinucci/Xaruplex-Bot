const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Mostra como os comandos funcionam'),


  run: async ({ interaction, client, handler }) => {
	  await interaction.deferReply();  

      const helpEmbed = new EmbedBuilder()
      .setColor("#e66229")
      .setTitle("Ajuda")
      .setDescription(`\nGerenciamento de Servidor
      /autorole | Dá um cargo ao usuário quando ele entra
      /autoroom-setup | Um menu de configuração para autorooms
      /level-settings | Desabilita ou habilita níveis
      /welcome-setup | Um menu de configuração para welcomes
      \nSorteios
      /giveaway create | Cria um sorteio
      /giveaway delete | Deleta um sorteio ativo
      /giveaway end | Termina um sorteio atualmente em andamento
      /giveaway reroll | Rola novamente um sorteio (Não pode ser mais antigo que 3 meses)
      /giveaway view-entries | Visualiza quem entrou no sorteio
      \nModeração
      /ban | Banir um usuário do servidor
      /kick | Expulsar um usuário do servidor
      /timeout | Define uma duração de timeout personalizada para um usuário
      \nEconomia
      /balance | Ver seu próprio saldo ou o de outro usuário
      /daily | Resgatar seu prêmio diário
      /level | Ver seu próprio nível ou o de outro usuário
      /leaderboard | Mostra os top níveis neste servidor.
      \nMúsica
      /play | Tocar uma música ou playlist
      /queue | Mostra a fila atual
      /info | Mostra detalhes sobre a música atual
      /skipto | Pular para uma certa música na fila
      /skip | Pular a música atual
      /seek | Pular para um tempo especificado
      /autoplay | Encontra e toca uma música automaticamente no final da fila
      /disconnet | Remove o bot do canal de voz
      /radio | Tocar de uma estação de rádio
      /pause | Retoma a reprodução
      /player-settings | Personaliza o player de música para o seu gosto
      /status | Mostra o status atual do motor de música
      /stats | Mostra algumas estatísticas legais da música
      `);
 
      interaction.editReply({
        embeds: [helpEmbed],
        components: [],
      });
  },
  // devOnly: Boolean,
  //testOnly: true,
  //deleted: true,
};
