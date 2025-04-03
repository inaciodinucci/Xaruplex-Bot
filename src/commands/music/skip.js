const { Client, Interaction, ApplicationCommandOptionType , SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
module.exports =  {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula a música atual."),

  run: async ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      interaction.reply({ content: "You can only run this command in a server.", ephemeral: true,});
     return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz, seu inútil.',ephemeral: true})
      return;
  }
  switch (client.playerType) {
    case "both":
      const Lavaplayer = client.manager.players.get(interaction.guild.id);
      const Discordplayer = useQueue(interaction.guild.id)
      if (!Lavaplayer && !Discordplayer) {
       return interaction.reply({content: `Não tem nada tocando, seu burro. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
      if (Discordplayer) {
       Discordplayer.node.skip()
       interaction.reply("Música pulada. Também, que lixo de música você colocou hein?")
      } else if (Lavaplayer) {
       Lavaplayer.skip();
        interaction.reply("Música pulada. Também, que lixo de música você colocou hein?")
      } else {
        return interaction.reply({content: `Não tem nada tocando, seu burro. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
    break;
    case "lavalink":
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) {
        return interaction.reply({content: `Não tem nada tocando, seu burro. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
       }
        player.skip();
        interaction.reply("Música pulada. Também, que lixo de música você colocou hein?")
    break;
    case "discord_player":
      const queue = useQueue(interaction.guildId)
      if (!queue || !queue.isPlaying()) {
        interaction.reply({content: `Não tem nada tocando, seu burro. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
        return;
    }
        queue.node.skip()
        interaction.reply("Música pulada. Também, que lixo de música você colocou hein?")
    break;
  }

  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
