const { EmbedBuilder , SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
module.exports =  {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa ou resume uma música."),

  run: async ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode executar este comando em um servidor.",
        ephemeral: true,
      });
     return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz, seu retardado.',ephemeral: true})
      return;
    } 
    if (!interaction.member.voice.channel) {
      interaction.reply({content: `Não tem nada tocando, seu animal. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      return;
  } 
    let playing
    switch (client.playerType) {
      case "both":
        const Lavaplayer = client.manager.players.get(interaction.guild.id);
        const Discordplayer = useQueue(interaction.guild.id)
        if (!Lavaplayer && !Discordplayer) {
         return interaction.reply({content: `Não tem nada tocando, seu animal. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
        }
        if (Discordplayer) {
          let playing = !Discordplayer.node.isPaused();
          if (playing) {
            const PlayerPauseEmbed = await new EmbedBuilder() 
            .setColor('#e66229')
              .setDescription(`${interaction.user} pausou a fila. Não aguentou ouvir essa música horrível, né?`)
            interaction.reply({ embeds: [PlayerPauseEmbed]})
            Discordplayer.node.pause()
              
          } else {
            const PlayerResumedEmbed = await new EmbedBuilder() 
            .setColor('#e66229')
              .setDescription(`${interaction.user} continuou a fila. Decidiu sofrer mais um pouco, coitado.`)
            interaction.reply({ embeds: [PlayerResumedEmbed]})
            Discordplayer.node.resume();
          }
        } else if (Lavaplayer) {
          playing = Lavaplayer.paused
          if (!playing) {
            const PlayerPauseEmbed = await new EmbedBuilder() 
            .setColor('#e66229')
              .setDescription(`${interaction.user} pausou a fila. Não aguentou ouvir essa música horrível, né?`)
            interaction.reply({ embeds: [PlayerPauseEmbed]})
            Lavaplayer.pause(true);
              
          } else {
            const PlayerResumedEmbed = await new EmbedBuilder() 
            .setColor('#e66229')
              .setDescription(`${interaction.user} continuou a fila. Decidiu sofrer mais um pouco, coitado.`)
            interaction.reply({ embeds: [PlayerResumedEmbed]})
            Lavaplayer.pause(false);
          }
        } else {
          return interaction.reply({content: `Não tem nada tocando, seu animal. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
        }
      break;
      case "lavalink":
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) {
          return interaction.reply({content: `Não tem nada tocando, seu animal. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
         }
         playing = player.paused
         if (!playing) {
           const PlayerPauseEmbed = await new EmbedBuilder() 
           .setColor('#e66229')
             .setDescription(`${interaction.user} pausou a fila. Não aguentou ouvir essa música de merda, né?`)
           interaction.reply({ embeds: [PlayerPauseEmbed]})
           player.pause(true);
             
         } else {
           const PlayerResumedEmbed = await new EmbedBuilder() 
           .setColor('#e66229')
             .setDescription(`${interaction.user} continuou a fila. Decidiu sofrer mais um pouco, coitado.`)
           interaction.reply({ embeds: [PlayerResumedEmbed]})
           player.pause(false);
         }
      break;
      case "discord_player":
        const queue = useQueue(interaction.guildId)
        if (!queue || !queue.isPlaying()) {
          interaction.reply({content: `Não tem nada tocando, seu animal. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
          return;
      }
       playing = !queue.node.isPaused();
      if (playing) {
        const PlayerPauseEmbed = await new EmbedBuilder() 
        .setColor('#e66229')
          .setDescription(`${interaction.user} pausou a fila. Não aguentou ouvir essa música de merda, né?`)
        interaction.reply({ embeds: [PlayerPauseEmbed]})
          queue.node.pause()
          
      } else {
        const PlayerResumedEmbed = await new EmbedBuilder() 
        .setColor('#e66229')
          .setDescription(`${interaction.user} continuou a fila. Decidiu sofrer mais um pouco, coitado.`)
        interaction.reply({ embeds: [PlayerResumedEmbed]})
          queue.node.resume();
      }
      break;
    }


  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
