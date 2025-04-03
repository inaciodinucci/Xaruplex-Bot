const {SlashCommandBuilder,} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Testa a conexão do bot'),


  run: async ({ interaction, client, handler }) => {
    try {
    await interaction.deferReply();

	  const reply = await interaction.fetchReply();

	  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
	  interaction.editReply(
		`Pong, seu lixo! Cliente: ${ping}ms | Websocket: ${client.ws.ping}ms - Que conexão horrível`
	  );
          
  } catch (error) {
   console.log("error while running ping",error)   
  }
  },
  // devOnly: Boolean,
  //testOnly: true,
  //deleted: true,
};
