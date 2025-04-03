const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Ativa ou desativa a reprodução automática"),

  run: async ({ interaction, client, handler }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode usar esse comando em um servidor, seu burro.",
        ephemeral: true,
      });
      return;
    }
    if (!interaction.member.voice.channel) {
      interaction.reply({content: 'Você não está conectado a um canal de voz, animal.',ephemeral: true})
      return;
  }
     try {
    switch (client.playerType) {
      case "both":
        const Lavaplayer = client.manager.players.get(interaction.guild.id);
        const Discordplayer = useQueue(interaction.guild.id);
        if (!Lavaplayer && !Discordplayer) {
          return interaction.reply({
            content: `Não tem nada tocando, seu imbecil. \nToca alguma coisa usando **\`/play\`** primeiro`,
            ephemeral: true,
          });
        }
        if (Discordplayer) {
          let repeatMode = Discordplayer.repeatMode;

          if (repeatMode === 0) {
            const embed = new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`**Reprodução automática ativada, já que você é incompetente demais pra escolher músicas por conta própria**`)
              .setFooter({ text: `Use esse comando de novo pra desativar, se for capaz.` });
            interaction.reply({ embeds: [embed] });
            Discordplayer.setRepeatMode(3);
          } else {
            const embed2 = new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`**Reprodução automática desativada, agora você vai ter que escolher músicas por si mesmo, coitado**`)
              .setFooter({ text: `Use esse comando de novo pra ativar, se precisar de ajuda.` });
            interaction.reply({ embeds: [embed2] });
            Discordplayer.setRepeatMode(0);
          }

        } else if (Lavaplayer) {
          if (Lavaplayer.customData.autoPlay === false) {
            const embed = new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`**Reprodução automática ativada, já que você é incompetente demais pra escolher músicas por conta própria**`)
              .setFooter({ text: `Use esse comando de novo pra desativar, se for capaz.` });
            interaction.reply({ embeds: [embed] });
            Lavaplayer.customData.autoPlay = true
            Lavaplayer.setLoop("none")

          } else {
            const embed2 = new EmbedBuilder()
              .setColor("#e66229")
              .setDescription(`**Reprodução automática desativada, agora você vai ter que escolher músicas por si mesmo, coitado**`)
              .setFooter({ text: `Use esse comando de novo pra ativar, se precisar de ajuda.` });
            interaction.reply({ embeds: [embed2] });
            Lavaplayer.customData.autoPlay = false
          }

        } else {
          return interaction.reply({
            content: `Não tem nada tocando, seu imbecil. \nToca alguma coisa usando **\`/play\`** primeiro`,
            ephemeral: true,
          });
        }
        break;
      case "lavalink":
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) {
          return interaction.reply({
            content: `Não tem nada tocando, seu imbecil. \nToca alguma coisa usando **\`/play\`** primeiro`,
            ephemeral: true,
          });
        }
        if (player.customData.autoPlay === false) {
          const embed = new EmbedBuilder()
            .setColor("#e66229")
            .setDescription(`**Reprodução automática ativada, já que você é incompetente demais pra escolher músicas por conta própria**`)
            .setFooter({ text: `Use esse comando de novo pra desativar, se for capaz.` });
          interaction.reply({ embeds: [embed] });
          player.customData.autoPlay = true
          player.setLoop("none")

        } else {
          const embed2 = new EmbedBuilder()
            .setColor("#e66229")
            .setDescription(`**Reprodução automática desativada, agora você vai ter que escolher músicas por si mesmo, coitado**`)
            .setFooter({ text: `Use esse comando de novo pra ativar, se precisar de ajuda.` });
          interaction.reply({ embeds: [embed2] });
          player.customData.autoPlay = false
        }
        break;
      case "discord_player":
        const queue = useQueue(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
          interaction.reply({
            content: `Não tem nada tocando, seu imbecil. \nToca alguma coisa usando **\`/play\`** primeiro`,
            ephemeral: true,
          });
          return;
        }
        let repeatMode = queue.repeatMode;

        if (repeatMode === 0) {
          const embed = new EmbedBuilder()
            .setColor("#e66229")
            .setDescription(`**Reprodução automática ativada, já que você é incompetente demais pra escolher músicas por conta própria**`)
            .setFooter({ text: `Use esse comando de novo pra desativar, se for capaz.` });
          interaction.reply({ embeds: [embed] });
          queue.setRepeatMode(3);
        } else {
          const embed2 = new EmbedBuilder()
            .setColor("#e66229")
            .setDescription(`**Reprodução automática desativada, agora você vai ter que escolher músicas por si mesmo, coitado**`)
            .setFooter({ text: `Use esse comando de novo pra ativar, se precisar de ajuda.` });
          interaction.reply({ embeds: [embed2] });
          queue.setRepeatMode(0);
        }
        break;
    }
  } catch (error) {
   console.log('error running autoplay command', error)   
  }
    return;
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: true
  },
};
