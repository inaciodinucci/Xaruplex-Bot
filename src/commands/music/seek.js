const { Client, Interaction, ApplicationCommandOptionType , SlashCommandBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
module.exports =  {
    data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Pula um tempo de uma música")
    .addIntegerOption((option) => option.setName("seconds").setDescription("A quantidade de segundos para pular.").setRequired(true)),

  run: async ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: "Você só pode usar esse co mando em um servidor.",
        ephemeral: true,
      });
    }
  
    const seconds = interaction.options.getInteger("seconds");
  
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'Você não está conectado a um canal de voz.', ephemeral: true });
    }
  
    switch (client.playerType) {
      case "both":

        const Lavaplayer = client.manager.players.get(interaction.guild.id);
        const Discordplayer = useQueue(interaction.guild.id)
        if (!Lavaplayer && !Discordplayer) {
         return interaction.reply({content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`,ephemeral: true})
        }
        if (Discordplayer) {
          Discordplayer.node.seek(seconds * 1000 + Discordplayer.node.getTimestamp()?.current.value);
        } else if (Lavaplayer) {
          if (!Lavaplayer) return interaction.reply({ content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`, ephemeral: true });
          const currentPos = Lavaplayer.queue.kazagumoPlayer.shoukaku.position / 1000; 
          const songLength = Lavaplayer.queue.current.length / 1000; 
          let newPosition = currentPos + seconds; 
          if (newPosition >= songLength) {
            newPosition = songLength - 1;
          }
          
          if (newPosition < 0 || newPosition > songLength) {
            return interaction.reply({ content: "Você não pode avançar além do tempo da música!", ephemeral: true });
          }
          await Lavaplayer.seek(newPosition * 1000); 
        } else {
          return interaction.reply({content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`,ephemeral: true})
        }

      break;
      case "discord_player":
        const queue = useQueue(interaction.guildId);

        if (!queue || !queue.isPlaying()) {
          return interaction.reply({ content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`, ephemeral: true });
        }
        queue.node.seek(seconds * 1000 + queue.node.getTimestamp()?.current.value);

        break;
      case "lavalink":

        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: `Não tem nada tocando. \nToca alguma coisa usando **\`/play\`**`, ephemeral: true });
        const currentPos = player.queue.kazagumoPlayer.shoukaku.position / 1000; 
        const songLength = player.queue.current.length / 1000; 
        let newPosition = currentPos + seconds; 
        if (newPosition >= songLength) {
          newPosition = songLength - 1;
        }
        
        if (newPosition < 0 || newPosition > songLength) {
          return interaction.reply({ content: "Você não pode avançar além do tempo da música!", ephemeral: true });
        }
        await player.seek(newPosition * 1000); 
        break;
      default:
        return interaction.reply({ content: `Tipo de player não suportado: ${client.playerType}`, ephemeral: true });
    }
  
    return interaction.reply(`Avançei ${seconds} segundos. Queria poder avançar logo pro final dessa música horrorosa.`);
  
    
  },

  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: true

};
