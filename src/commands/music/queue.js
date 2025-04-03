const { Client, Interaction, ApplicationCommandOptionType , SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle ,ActionRowBuilder} = require("discord.js");
const { useQueue } = require('discord-player');
const { convertTime } = require("../../utils/ConvertTime.js");

module.exports =  {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Mostra todas as músicas atuais na fila"),

  run: async ({ interaction, client, handler }) =>  {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode usar esse comando em um servidor, seu idiota.",
        ephemeral: true,
      });
     return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz, seu inútil.',ephemeral: true})
      return;
  }
  let embeds = [];
  const chunkSize = 10;
  let pages  = 0;
  let currentIndex = 0;
  const prevButton = new ButtonBuilder()
  .setCustomId("prev")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("⬅️");

const nextButton = new ButtonBuilder()
  .setCustomId("next")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("➡️");

const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

  switch (client.playerType) {
    case "both":
      const Lavaplayer = client.manager.players.get(interaction.guild.id);
      const Discordplayer = useQueue(interaction.guild.id)
      if (!Lavaplayer && !Discordplayer) {
       return interaction.reply({content: `Não tem nada tocando, otário. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
      if (Discordplayer) {
        const formatTracks = Discordplayer.tracks.toArray();

        if (formatTracks.length === 0) {
          return interaction.reply({
            content: `Não tem mais nenhuma música na fila, seu cego. Use **/info** pra ver informações sobre a música atual.`,
            ephemeral: true,
          });
        }
    
        const tracks = formatTracks.map(
          (track, idx) => `**${idx + 1}.** [${track.title}](${track.url}) - ${track.author} | ${track.requestedBy}`
        );
        
        pages = Math.ceil(tracks.length / chunkSize);
    
        for (let i = 0; i < pages; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
    
          const embed = new EmbedBuilder()
            .setColor("#e66229")
            .setTitle("Fila de Músicas Horríveis")
            .setDescription(
              tracks.slice(start, end).join("\n") || "**Nenhuma música na fila, graças a Deus**"
            )
            .setFooter({
              text: `Página ${i + 1}/${pages} | Músicas: ${Discordplayer.tracks.size} | Tempo restante: ${Discordplayer.durationFormatted} de tortura sonora`,
            });
    
          embeds.push(embed);
        }
    
        if (embeds.length === 1) {
          return interaction.reply({
            embeds: [embeds[0]],
          });
        }
    
        const message = await interaction.reply({
          embeds: [embeds[0]],
          components: [row],
          fetchReply: true,
        });
    
        const collector = message.createMessageComponentCollector({
          idle: 60000,
        });
    
        collector.on("collect", (i) => {
          i.deferUpdate();
    
          switch (i.customId) {
            case "prev":
              currentIndex =
                currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
              break;
            case "next":
              currentIndex =
                currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
              break;
            default:
              break;
          }
    
          interaction.editReply({
            embeds: [embeds[currentIndex]],
            components: [row],
          });
        });
    
        collector.on("end", () => {
          message.edit({
            components: [],
          });
        });
      } else if (Lavaplayer) {
        if (Lavaplayer.queue.length === 0) {
          return interaction.reply({
            content: `Não tem mais nenhuma música na fila, seu cego. Use **/info** pra ver informações sobre a música atual.`,
            ephemeral: true,
          });
        }
         const tracks2 = Lavaplayer.queue.map(
          (track, idx) => `\`${idx + 1}.\` [${track.title}](${track.uri}) - ${track.author} | ${track.requester}`
        );
    
         pages = Math.ceil(tracks2.length / chunkSize);
  
        for (let i = 0; i < pages; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
    
          const embed = new EmbedBuilder()
            .setColor("#e66229")
            .setTitle("Fila de Músicas de Péssimo Gosto")
            .setDescription(
              tracks2.slice(start, end).join("\n") || "**Nenhuma música na fila, ufa!**"
            )
            .setFooter({
              text: `Página ${i + 1}/${pages} | Músicas: ${Lavaplayer.queue.size} | Tempo restante: ${convertTime(Lavaplayer.queue.durationLength)} de sofrimento`,
            });
    
          embeds.push(embed);
        }
    
        if (embeds.length === 1) {
          return interaction.reply({
            embeds: [embeds[0]],
          });
        }
        const message2 = await interaction.reply({
          embeds: [embeds[0]],
          components: [row],
          fetchReply: true,
        });
    
        const collector2 = message2.createMessageComponentCollector({
          idle: 60000,
        });
    
        collector2.on("collect", (i) => {
          i.deferUpdate();
    
          switch (i.customId) {
            case "prev":
              currentIndex =
                currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
              break;
            case "next":
              currentIndex =
                currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
              break;
            default:
              break;
          }
    
          interaction.editReply({
            embeds: [embeds[currentIndex]],
            components: [row],
          });
        });
    
        collector2.on("end", () => {
          message2.edit({
            components: [],
          });
        });
      } else {
        return interaction.reply({content: `Não tem nada tocando, otário. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
      }
    break;
    case "lavalink":
      const player = client.manager.players.get(interaction.guild.id);
      if (!player) {
        return interaction.reply({content: `Não tem nada tocando, otário. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
       }
       if (player.queue.length === 0) {
        return interaction.reply({
          content: `Não tem mais nenhuma música na fila, seu cego. Use **/info** pra ver informações sobre a música atual.`,
          ephemeral: true,
        });
      }
       const tracks2 = player.queue.map(
        (track, idx) => `\`${idx + 1}.\` [${track.title}](${track.uri}) - ${track.author} | ${track.requester}`
      );
  
       pages = Math.ceil(tracks2.length / chunkSize);

      for (let i = 0; i < pages; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
  
        const embed = new EmbedBuilder()
          .setColor("#e66229")
          .setTitle("Fila de Músicas de Péssimo Gosto")
          .setDescription(
            tracks2.slice(start, end).join("\n") || "**Nenhuma música na fila, ufa!**"
          )
          .setFooter({
            text: `Página ${i + 1}/${pages} | Músicas: ${player.queue.size} | Tempo restante: ${convertTime(player.queue.durationLength)} de sofrimento`,
          });
  
        embeds.push(embed);
      }
  
      if (embeds.length === 1) {
        return interaction.reply({
          embeds: [embeds[0]],
        });
      }
      const message2 = await interaction.reply({
        embeds: [embeds[0]],
        components: [row],
        fetchReply: true,
      });
  
      const collector2 = message2.createMessageComponentCollector({
        idle: 60000,
      });
  
      collector2.on("collect", (i) => {
        i.deferUpdate();
  
        switch (i.customId) {
          case "prev":
            currentIndex =
              currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
            break;
          case "next":
            currentIndex =
              currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
            break;
          default:
            break;
        }
  
        interaction.editReply({
          embeds: [embeds[currentIndex]],
          components: [row],
        });
      });
  
      collector2.on("end", () => {
        message2.edit({
          components: [],
        });
      });
    break;
    case "discord_player":
      const queue = useQueue(interaction.guildId)
      if (!queue || !queue.isPlaying()) {
        interaction.reply({content: `Não tem nada tocando, otário. \nToca alguma coisa usando **\`/play\`** primeiro`,ephemeral: true})
        return;
    }
    const formatTracks = queue.tracks.toArray();

    if (formatTracks.length === 0) {
      return interaction.reply({
        content: `Não tem mais nenhuma música na fila, seu cego. Use **/info** pra ver informações sobre a música atual.`,
        ephemeral: true,
      });
    }

    const tracks = formatTracks.map(
      (track, idx) => `**${idx + 1}.** [${track.title}](${track.url}) - ${track.author} | ${track.requestedBy}`
    );
    
    pages = Math.ceil(tracks.length / chunkSize);

    for (let i = 0; i < pages; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;

      const embed = new EmbedBuilder()
        .setColor("#e66229")
        .setTitle("Fila de Músicas Horríveis")
        .setDescription(
          tracks.slice(start, end).join("\n") || "**Nenhuma música na fila, graças a Deus**"
        )
        .setFooter({
          text: `Página ${i + 1}/${pages} | Músicas: ${queue.tracks.size} | Tempo restante: ${queue.durationFormatted}`,
        });

      embeds.push(embed);
    }

    if (embeds.length === 1) {
      return interaction.reply({
        embeds: [embeds[0]],
      });
    }

    const message = await interaction.reply({
      embeds: [embeds[0]],
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      idle: 60000,
    });

    collector.on("collect", (i) => {
      i.deferUpdate();

      switch (i.customId) {
        case "prev":
          currentIndex =
            currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
          break;
        case "next":
          currentIndex =
            currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
          break;
        default:
          break;
      }

      interaction.editReply({
        embeds: [embeds[currentIndex]],
        components: [row],
      });
    });

    collector.on("end", () => {
      message.edit({
        components: [],
      });
    });
    break;
  }

  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
