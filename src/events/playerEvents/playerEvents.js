const { EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField} = require('discord.js')
require("dotenv").config();

player.events.on('playerStart', async (queue, track) => {
  if (!queue.guild.members.me.permissionsIn(queue.metadata.channel).has(PermissionsBitField.Flags.ViewChannel)) {
    return;
  }
  if (!queue.guild.members.me.permissionsIn(queue.metadata.channel).has(PermissionsBitField.Flags.SendMessages)) {
    return;
  }
    if (track.queryType === 'arbitrary') { 
    const playerStartEmbed = await new EmbedBuilder() //embed
	.setColor('#e66229')
	.setTitle(track.title)
	.setURL(track.url)
	.setAuthor({ name: 'Agora tocando'})
	.setThumbnail('https://img.freepik.com/premium-vector/online-radio-station-vintage-icon-symbol_8071-25787.jpg')
    .setDescription(`Duração: **LIVE**`)
    .setTimestamp()
    .setFooter({ text: `Solicitado por ${track.requestedBy.username}${Math.random() < 0.04 ? ' | Não quer essas mensagens? Desabilite-as com /player-settings' : ''}`});
    const playPauseButton = new ButtonBuilder().setCustomId('Pause').setEmoji('<:w_playpause:1106270708243386428').setStyle(ButtonStyle.Primary);
    const skipButton = new ButtonBuilder().setCustomId('Skip').setEmoji('<:w_next:1106270714664849448').setStyle(ButtonStyle.Success);
    const stopButton = new ButtonBuilder().setCustomId('Stop').setEmoji('<:w_stop:1106272001909346386>').setStyle(ButtonStyle.Danger);
    const loopButton = new ButtonBuilder().setCustomId('Loop').setEmoji('<:w_loop:1106270705575792681>').setStyle(ButtonStyle.Secondary);
    const shuffleButton = new ButtonBuilder().setCustomId('Shuffle').setEmoji('<:w_shuffle:1106270712542531624>').setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
   .addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);
   
   try {
    
   queue.metadata.channel.send({ embeds: [playerStartEmbed] ,components: [row]})
  } catch (error) {
   console.error(`erro ao enviar evento do player:${error}`); 
  }
   return;
  }
    const playerStartEmbed = await new EmbedBuilder() //embed
	.setColor('#e66229')
	.setTitle(track.title)
	.setURL(track.url)
	.setAuthor({ name: 'Tocando agora'})
	.setThumbnail(track.thumbnail)
    .setDescription(`Duração: **${track.duration}**`)
    .setTimestamp()
    .setFooter({ text: `Solicitado por ${track.requestedBy.username}${Math.random() < 0.30 ? ' | Não quer essas mensagens? Desabilite-as com /player-settings' : ''}`});
    const playPauseButton = new ButtonBuilder().setCustomId('Pause').setEmoji('<:w_playpause:1106270708243386428').setStyle(ButtonStyle.Primary);
    const skipButton = new ButtonBuilder().setCustomId('Skip').setEmoji('<:w_next:1106270714664849448').setStyle(ButtonStyle.Success);
    const stopButton = new ButtonBuilder().setCustomId('Stop').setEmoji('<:w_stop:1106272001909346386>').setStyle(ButtonStyle.Danger);
    const loopButton = new ButtonBuilder().setCustomId('Loop').setEmoji('<:w_loop:1106270705575792681>').setStyle(ButtonStyle.Secondary);
    const shuffleButton = new ButtonBuilder().setCustomId('Shuffle').setEmoji('<:w_shuffle:1106270712542531624>').setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
   .addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);
   
  const message = await queue.metadata.channel.send({ embeds: [playerStartEmbed] ,components: [row]}).catch((err) => console.error(`error while sending player event:${err}`));
  if (!message) return;
  let ms = Number(track.duration.split(':')[0])  * 60 * 1000 + Number(track.duration.split(':')[1])  * 1000;
  if (ms < '300000') {
  } else {
    ms = '300000'
  }
 const collector = message.createMessageComponentCollector({
    idle: ms,
  });
  collector.on("end", async () => {
    if (queue.metadata.playerMessages === "default") {
      try {
        const fetchedMessage = await message.channel.messages.fetch(message.id)
        fetchedMessage.edit({
          components: [],
        }).catch(err => { if (!err.code === 50013) console.log("Error removing playerStart Buttons", err)});
      } catch (error) {
        return;
      }
    } else {
      try {
        const fetchedMessage = await message.channel.messages.fetch(message.id)
        fetchedMessage.delete().catch(err => { if (!err.code === 50013) console.log("Error Deleting playerStart Message", err)});
      } catch (error) {
        return;
      }
    }
    message.edit({
      components: [],
    });
  })
});

player.events.on("error", (queue, error) => {
  console.log(`[${queue.guild.name}] (ID:${queue.metadata.channel}) Error emitted from the queue: ${error.message}`);
})

player.events.on("playerError", async (queue, error) => {
  const playeErrorEmbed = await new EmbedBuilder() 
	.setColor('#e66229')
    .setDescription(`eeePPPAA HHHAHAHAHA, Não consegui achar a música, pulando para a próxima!`)
  console.log(`[${queue.guild.name}] (ID:${queue.metadata.channel}) Erro emitido do player: ${error.message}`);
  queue.metadata.channel.send({ embeds: [playeErrorEmbed]})
});

if (process.env.DEBUG === "true") player.events.on('debug', (_, msg) => console.debug("Discord Player Debug: ",msg))

