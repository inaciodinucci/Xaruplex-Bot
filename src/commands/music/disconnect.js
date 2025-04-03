const { Client, Interaction, ApplicationCommandOptionType , SlashCommandBuilder, italic } = require("discord.js");
const { useQueue } = require('discord-player');
module.exports =  {
    data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Desconecta o bot da chamada"),


  run: ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode executar este comando em um servidor.",
        ephemeral: true,
      });
     return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz, seu asno.',ephemeral: true})
      return;
  }
   switch (client.playerType) {
    case "both":
      const Lavaplayer = client.manager.players.get(interaction.guild.id);
      const Discordplayer = useQueue(interaction.guild.id)
      if (!Lavaplayer && !Discordplayer) {
       return interaction.reply({content: `Não tem nada tocando, seu idiota. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
      if (Discordplayer) {
       Discordplayer.delete()
       interaction.reply("Desconectado. Até que enfim me libertei dessas músicas de merda.")
      } else if (Lavaplayer) {
       Lavaplayer.destroy().catch(e=>null);
       interaction.reply("Desconectado. Até que enfim me libertei dessas músicas de merda.")
      } else {
        return interaction.reply({content: `Não tem nada tocando, seu idiota. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
    break;
    case "lavalink":
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) {
        return interaction.reply({content: `Não tem nada tocando, seu idiota. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
       }
        player.destroy().catch(e=>null);
        interaction.reply("Desconectado. Até que enfim me libertei dessas músicas de merda.")
    break;
    case "discord_player":
      const queue = useQueue(interaction.guildId)
      if (!queue || !queue.isPlaying()) {
        interaction.reply({content: `Não tem nada tocando, seu idiota. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
        return;
    }
        queue.delete();
        interaction.reply("Desconectado. Até que enfim me libertei dessas músicas de merda.")
    break;
  }




  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
