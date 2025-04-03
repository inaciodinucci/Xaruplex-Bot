const {Client,Interaction,PermissionsBitField,ChannelType,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle,} = require("discord.js");
const { useQueue } = require("discord-player");
const Ticket = require("../../models/Ticket");
const Giveaway = require("../../models/Giveaway");

module.exports = async (interaction, client, handler) => {
  if (interaction.isButton()) {
    const buttonname = interaction.customId;
    const user = interaction.user.username;
    const usera = interaction.user;
    const discriminator = interaction.user.discriminator;
    const queue = useQueue(interaction.guildId);
    let player;
    if (client.playerType === 'lavalink' || client.playerType === 'both') { 
      player = client.manager.players.get(interaction.guildId);
     }
    try {
      switch (buttonname) {
        case "LavaPause":
          try {
            let playing = player.paused
            if (!playing) {
              const LavaPlayerPauseEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} pausou a fila.`);
              interaction.reply({ embeds: [LavaPlayerPauseEmbed] });
              player.pause(true);
            } else {
              const LavaPlayerResumedEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} retomou a fila.`);
              interaction.reply({ embeds: [LavaPlayerResumedEmbed] });
              player.pause(false);
            }
          } catch {
            interaction.reply({
              content: `O bot não está em um canal de voz`,
              ephemeral: true,
            });
          }

          break;
        case "LavaSkip":
          if (!player) {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          } else {
            player.skip();
            const LavaPlayerSkipEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} pulou uma música.`);
            interaction.reply({ embeds: [LavaPlayerSkipEmbed] });
          }

          break;
        case "LavaStop":
          try {
            if (!player ) return interaction.reply({content: `O bot não está em um canal de voz`,ephemeral: true });
            player.destroy().catch(e => null);
            const LavaPlayerStopEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} me desconectou do canal. Até que enfim me libertei dessas músicas de merda.`);
            interaction.reply({ embeds: [LavaPlayerStopEmbed] });
          } catch {
            interaction.reply({
              content: `O bot não está em um canal de voz`,
              ephemeral: true,
            });
          }

          break;
        case "LavaLoop":
          try {
            if (player.loop === "queue") {
              const LavaPlayerLoopEmbed2 = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} desativou o loop da fila.`);
            interaction.reply({ embeds: [LavaPlayerLoopEmbed2] });
            player.setLoop("none")
            } else {
              const LavaPlayerLoopEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} ativou o loop da fila.`);
              interaction.reply({ embeds: [LavaPlayerLoopEmbed] });
              player.setLoop("queue")

            }
          } catch {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          }

          break;
        case "LavaShuffle":
          try {
            player.queue.shuffle();
            const PlayerShuffleEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} embaralhou a fila.`);
            interaction.reply({ embeds: [PlayerShuffleEmbed] });
          } catch {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          } 

          break;
        case "Pause":
          try {
            let playing = !queue.node.isPaused();
            if (playing) {
              const PlayerPauseEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} pausou a fila.`);
              interaction.reply({ embeds: [PlayerPauseEmbed] });
              queue.node.pause();
            } else {
              const PlayerResumedEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} retomou a fila.`);
              interaction.reply({ embeds: [PlayerResumedEmbed] });
              queue.node.resume();
            }
          } catch {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          }

          break;
        case "Skip":
          if (!queue || !queue.isPlaying()) {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          } else {
            queue.node.skip();
            const PlayerSkipEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} pulou uma música.`);
            interaction.reply({ embeds: [PlayerSkipEmbed] });
          }

          break;

        case "Stop":
          try {
            queue.delete();
            const PlayerStopEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} me desconectou do canal. Até que enfim me libertei dessas músicas de merda.`);
            interaction.reply({ embeds: [PlayerStopEmbed] });
          } catch {
            interaction.reply({
              content: `O bot não está em um canal de voz, seu cego`,
              ephemeral: true,
            });
          }

          break;
        case "Loop":
          try {
            let repeatMode = queue.repeatMode;
            if (repeatMode === 0) {
              const PlayerLoopEmbed = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} ativou o loop da fila.`);
              interaction.reply({ embeds: [PlayerLoopEmbed] });
              queue.setRepeatMode(2);
            } else {
              const PlayerLoopEmbed2 = await new EmbedBuilder()
                .setColor("#e66229")
                .setDescription(`${usera} desativou o loop da fila.`);
              interaction.reply({ embeds: [PlayerLoopEmbed2] });
              queue.setRepeatMode(0);
            }
          } catch {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          }

          break;
        case "Shuffle":
          try {
            queue.tracks.shuffle();
            const PlayerShuffleEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`${usera} embaralhou a fila.`);
            interaction.reply({ embeds: [PlayerShuffleEmbed] });
          } catch {
            interaction.reply({
              content: `Não há música sendo reproduzida`,
              ephemeral: true,
            });
          }

          break;
        case "Ticket":
          const ticket = await Ticket.findOne({
            guildId: interaction.guild.id,
          });
          if (
            !interaction.guild.members.me.permissions.has(
              PermissionsBitField.Flags.ManageChannels
            )
          )
            return await interaction.reply({
              content: "Não tenho permissão para gerenciar canais",
              ephemeral: true,
            });
          if (!ticket) {
            interaction.reply({
              content: `Os tickets foram desabilitados neste servidor, use **/ticket setup** ou **/ticket quicksetup** para reabilitar`,
              ephemeral: true,
            });
            return;
          }

          try {
            ticketChannel = await interaction.guild.channels.create({
              name: `ticket-${ticket.ticketNumber}`,
              type: ChannelType.GuildText,
              parent: `${ticket.category}`,
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: interaction.user.id,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: client.user.id,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: ticket.role,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                },
              ],
            });
            await interaction.reply({
              content: `Ticket criado ${ticketChannel}`,
              ephemeral: true,
            });
            ticket.ticketNumber = ticket.ticketNumber + 1;
            ticket.save();

            const ticketEmbed = await new EmbedBuilder()
              .setColor("#e66229")
              .setTitle(
                `${interaction.user.username}#${interaction.user.discriminator}'s ticket`
              );
            const Delete = new ButtonBuilder()
              .setCustomId("delete")
              .setLabel("Deletar")
              .setStyle(ButtonStyle.Danger);
            const Archive = new ButtonBuilder()
              .setCustomId("archive")
              .setLabel("Arquivar")
              .setStyle(ButtonStyle.Success);
            const row = new ActionRowBuilder().addComponents(Delete, Archive);
            setTimeout(delay, 1000);
            function delay() {
              ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
            }
          } catch (error) {
            console.log(error);
            interaction.reply({
              content: `A categoria do ticket ou o cargo de staff do ticket foi deletado \nPor favor, execute **/ticket disable** então **/ticket quicksetup** ou **/ticket setup**`,
              ephemeral: true,
            });
          }

          break;
        case "delete":
          if (
            !interaction.guild.members.me.permissions.has(
              PermissionsBitField.Flags.ManageChannels
            )
          )
            return await interaction.reply({
              content: "Não tenho permissão para gerenciar canais",
              ephemeral: true,
            });
          try {
            const channelTarget = interaction.channel;
            channelTarget.delete();
          } catch (error) {
            interaction.reply({
              content: `Erro ao deletar ${error}`,
              ephemeral: true,
            });
          }

          break;
        case "archive":
          let role = interaction.guild.roles;
          const ticket2 = await Ticket.findOne({
            guildId: interaction.guild.id,
          });
          if (
            !interaction.guild.members.me.permissions.has(
              PermissionsBitField.Flags.ManageChannels
            )
          )
            return await interaction.reply({
              content: "Não tenho permissão para gerenciar canais",
              ephemeral: true,
            });

          try {
            const channelTarget = interaction.channel;
            if (
              interaction.guild.roles.cache.some(
                (role) => role.id === ticket2.role
              )
            ) {
              channelTarget.permissionOverwrites.set([
                {
                  id: interaction.guild.id,
                  deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: ticket2.role,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                  id: client.user.id,
                  allow: [PermissionsBitField.Flags.ViewChannel],
                },
              ]);
              interaction.channel.setName(
                `${interaction.channel.name} Archived`
              );
              interaction.reply("**Ticket arquivado**");
            } else {
              interaction.reply({
                content: `O cargo de staff do ticket foi deletado \nPor favor, execute **/ticket disable** então **/ticket quicksetup** ou **/ticket setup**`,
                ephemeral: true,
              });
            }
          } catch (error) {
            console.log(error);
            interaction.reply({
              content: `A categoria do ticket ou o cargo de staff do ticket foi deletado \nPor favor, execute **/ticket disable** então **/ticket quicksetup** ou **/ticket setup**`,
              ephemeral: true,
            });
          }

          break;
        case "giveawayEnter":
          const giveaway = await Giveaway.findOne({
            messageId: interaction.message.id,
          });
          if (!giveaway) {
            interaction.reply({
              content: `Este sorteio terminou ou não existe, crie um novo com **/giveaway create**`,
              ephemeral: true,
            });
            return;
          }
          if (giveaway.requiredRole !== "null") {
            const roleRequired = giveaway.requiredRole;
            if (!interaction.member.roles.cache.has(roleRequired)) {
              interaction.reply({
                content: `Você não tem o cargo necessário para entrar neste sorteio`,
                ephemeral: true,
              });
              return;
            }
          }
          const existingEntry = giveaway.entriesArray.includes(
            interaction.user.id
          );
          if (existingEntry) {
            interaction.reply({
              content: "Você saiu do sorteio",
              ephemeral: true,
            });
            await Giveaway.updateOne(
              { _id: giveaway._id },
              { $pull: { entriesArray: interaction.user.id } }
            ).catch((error) => {
              console.error(
                "Erro ocorreu ao remover entrada do sorteio:",
                error
              );
            });
          } else {
            interaction.reply({
              content: "Você entrou no sorteio",
              ephemeral: true,
            });
            giveaway.entriesArray.push(interaction.user.id);
            await giveaway.save().catch((error) => {
              console.log("error while savi ng giveaway entries:", error);
            });
          }
          const updatedGiveaway = await Giveaway.findById(giveaway._id);
          const date = new Date(updatedGiveaway.giveawayEnd);
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          const timestamp = `<t:${unixTimestamp}:R>`;
          const discordIdCount = updatedGiveaway.entriesArray.length;
          const giveawayEmbed = new EmbedBuilder()
            .setColor("#e66229")
            .setTitle(updatedGiveaway.messageTitle)
            .setDescription(
              `Vencedores: ${updatedGiveaway.winners}\nEntradas: ${discordIdCount}\n Termina em: ${timestamp}`
            )
            .setFooter({ text: `Clique no botão abaixo para entrar` });
          const giveawayEnterButton = new ButtonBuilder()
            .setCustomId("giveawayEnter")
            .setEmoji("🎉")
            .setStyle(ButtonStyle.Success);
          const row = new ActionRowBuilder().addComponents(giveawayEnterButton);
          const message = await interaction.channel.messages.fetch(
            updatedGiveaway.messageId
          );
          message
            .edit({
              embeds: [giveawayEmbed],
              components: [row],
            })
            .catch((err) => {
              console.log(
                "erro ao enviar mensagem para o sorteio:",
                err
              );
            });
        default:
          break;
      }
    } catch (error) {
      console.log("erro com os botões", error);
    }
  }
};
