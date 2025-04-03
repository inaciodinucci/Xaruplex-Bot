const { Client, Interaction, ApplicationCommandOptionType , SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
module.exports =  {
    data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Pula para uma certa música na fila.")
    .addIntegerOption((option) => option.setName("amount").setDescription("A quantidade de segundos para pular.").setRequired(true)),

  run: async ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      interaction.reply({ content: "Você só pode usar esse comando em um servidor.", ephemeral: true,});
     return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz.',ephemeral: true})
      return;
  }
  const amount = interaction.options.getInteger("amount")

  switch (client.playerType) {
    case "both":
      const Lavaplayer = client.manager.players.get(interaction.guild.id);
      const Discordplayer = useQueue(interaction.guild.id)
      if (!Lavaplayer && !Discordplayer) {
       return interaction.reply({content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`,ephemeral: true})
      }
      if (Discordplayer) {
        if (amount > Discordplayer.tracks.data.length) {
          interaction.reply({
              content: `Há \`${Discordplayer.tracks.data.length}\` músicas na fila. Você não pode pular para \`${amount}\`.\n\nVeja todas as músicas na fila com **\`/queue\`**.`,
              ephemeral: true,
            });
            return;
      } 
      Discordplayer.node.skipTo(amount - 1);
      interaction.reply(`${amount} Músicas Pularam`)
      } else if (Lavaplayer) {
        if ((amount > Lavaplayer.queue.size) || (amount && !Lavaplayer.queue[amount - 1])) return           interaction.reply({ content: `There are \`${Lavaplayer.queue.size}\` tracks in the queue. You cant skip to \`${amount}\`.\n\nView all tracks in the queue with **\`/queue\`**.`, ephemeral: true,  });;
        if (amount == 1) Lavaplayer.skip();
    
        await Lavaplayer.queue.splice(0, amount - 1);
            await Lavaplayer.skip();
         interaction.reply(`${amount} Músicas Pularam`)
      } else {
        return interaction.reply({content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`,ephemeral: true})
      }
    break;
    case "lavalink":
      const player = client.manager.players.get(interaction.guild.id);
      if ((amount > player.queue.size) || (amount && !player.queue[amount - 1])) return           interaction.reply({ content: `There are \`${player.queue.size}\` tracks in the queue. You cant skip to \`${amount}\`.\n\nView all tracks in the queue with **\`/queue\`**.`, ephemeral: true,  });;
      if (amount == 1) player.skip();
  
      await player.queue.splice(0, amount - 1);
          await player.skip();
       interaction.reply(`${amount} Músicas Pularam`)

    break;
    case "discord_player":
      const queue = useQueue(interaction.guildId)
      if (!queue || !queue.isPlaying()) {
        interaction.reply({content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`,ephemeral: true})
        return;
    }
      if (amount > queue.tracks.data.length) {
        interaction.reply({
            content: `Há \`${queue.tracks.data.length}\` músicas na fila. Você não pode pular para \`${amount}\`.\n\nVeja todas as músicas na fila com **\`/queue\`**.`,
            ephemeral: true,
          });
          return;
    } 
    queue.node.skipTo(amount - 1);
    interaction.reply(`${amount} Músicas Pularam`)
    break;
  }
  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
