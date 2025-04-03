const {SlashCommandBuilder,EmbedBuilder} = require('discord.js');
const osu = require('node-os-utils');
const { useMainPlayer } = require('discord-player');



async function getPrettyMs() {
    const { default: prettyMilliseconds } = await import('pretty-ms');
    return prettyMilliseconds;
  }

module.exports = {
  data: new SlashCommandBuilder()
  .setName('status')
  .setDescription('Mostra estatísticas sobre o bot')
  .addStringOption(option => option
    .setName('ratelimit_check')
    .setDescription('Verifica se os nós estão sendo limitados')
    .addChoices(
        { name: 'Sim', value: 'yes' },
        { name: 'Não', value: 'false' },
    )),


  run: async ({ interaction, client, handler }) => {
    try {
      await interaction.deferReply();
      const uptimeMs = parseFloat(process.uptime().toFixed(0));
      const prettyMs = await getPrettyMs(); 
      const uptime = prettyMs(uptimeMs * 1000, {compact: true});
      const cpuUsage = await osu.cpu.usage();
      const memUsage = Math.ceil((await osu.mem.info()).usedMemMb);  
      const cpuCores = osu.cpu.count();

      let totalTracksPlayed = 0; // Initialize to 0

      if (client.cluster) {
        const results = await client.cluster.broadcastEval(c => c.totalTracksPlayed);
        totalTracksPlayed = results.reduce((acc, val) => acc + val, 0); // Sum results from all shards
      } else {
        totalTracksPlayed = client.totalTracksPlayed; // Use existing value if not sharded
      }

      switch (client.playerType) {
        case "both":
          const player2 = useMainPlayer();
          const playerStats3 = player2.generateStatistics()
          const playerStats4 = client.manager.shoukaku.nodes

      
          const embed3 = new EmbedBuilder()
          .setColor('#e66229')
          .setDescription(`**Status do Sistema**
                        **${uptime}** Tempo de Atividade  
                        **${cpuCores}** Núcleos de CPU  
                        **${cpuUsage}%** Uso da CPU
                        **${memUsage} MB** Uso da Memória`)
          .addFields(
              {
                name: "**Status do Player**",
                value: `
                      **${playerStats3.queues.length}** Canais Conectados
                      **${playerStats3.queues.reduce((acc, queue) => acc + queue.tracksCount, 0)}** Músicas na Fila
                      **${playerStats3.queues.reduce((acc, queue) => acc + queue.listeners, 0)}** Usuários escutando
                      **${totalTracksPlayed}** Músicas desde o último reinício` 
              }
            ).setFooter({text: `Shard: ${interaction.guild?.shardId ? interaction.guild?.shardId : '0'} | Cluster: ${client?.cluster.id}`})
            for (const node of playerStats4.values()) {
              embed3.addFields({
                name: `Node: ${node.name}`,
                value: `Players: ${node.stats?.players ? node.stats.players : '0'}\nPlaying: ${node.stats?.playingPlayers ? node.stats.playingPlayers : '0'}\nUptime: ${node.stats?.uptime ? prettyMs(node.stats?.uptime, {compact: true}) : 'N/A'}\nMemory: ${node.stats?.memory ? (node.stats.memory.used / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}\nCPU: ${node.stats?.cpu.systemLoad ? (node.stats.cpu.systemLoad * 100).toFixed(2) + '%' : 'N/A'}`,
              });
  }
            interaction.editReply({ embeds: [embed3] });
            break;
        break;
        case "lavalink":
        const playerStats2 = client.manager.shoukaku.nodes
        const embed2 = new EmbedBuilder()
        .setColor('#e66229')
        .setDescription(`**Status do Sistema**
                      **${uptime}** Tempo de Atividade  
                      **${cpuCores}** Núcleos de CPU  
                      **${cpuUsage}%** Uso da CPU
                      **${memUsage} MB** Uso da Memória
                    **${totalTracksPlayed}** Músicas desde o último reinício`).setFooter({text: `Shard: ${interaction.guild?.shardId ? interaction.guild?.shardId : '0'} | Cluster: ${client.cluster.id}`})
                    for (const node of playerStats2.values()) {
                      const options = interaction.options.get('ratelimit_check')?.value;
                      let RateLimited = '';
                      if (options === "yes")  {
                     const search = await client.manager.search("https://www.youtube.com/watch?v=C0DPdy98e4c", {engine: 'youtube', nodeName: node.name})
                      if (search.tracks?.length) {
                        RateLimited = '\n Limitado: False' 
                      } else {
                        RateLimited = '\n Limitado: True' 
                      }
                    }
                      embed2.addFields({
                        name: `Node: ${node.name}`,
                        value: `Players: ${node.stats?.players ? node.stats.players : '0'}\nPlaying: ${node.stats?.playingPlayers ? node.stats.playingPlayers : '0'}\nUptime: ${node.stats?.uptime ? prettyMs(node.stats?.uptime, {compact: true}) : 'N/A'}\nMemory: ${node.stats?.memory ? (node.stats.memory.used / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}\nCPU: ${node.stats?.cpu.systemLoad ? (node.stats.cpu.systemLoad * 100).toFixed(2) + '%' : 'N/A'}${RateLimited}`,
                      });
          }
       interaction.editReply({ embeds: [embed2] });
       
    break;  
    case "discord_player":
    const player = useMainPlayer();
    const playerStats = player.generateStatistics()

    const embed = new EmbedBuilder()
    .setColor('#e66229')
    .setDescription(`**Player Status**
                **${playerStats.queues.length}** Channels Connected
                **${playerStats.queues.reduce((acc, queue) => acc + queue.tracksCount, 0)}** Tracks Queued
                **${playerStats.queues.reduce((acc, queue) => acc + queue.listeners, 0)}** Users listening
                **${totalTracksPlayed}** Tracks Since Restart`)
    .addFields(
        {
          name: "**System Status**",
          value: `**${uptime}** Uptime  
                  **${cpuCores}** CPU Cores  
                  **${cpuUsage}%** CPU Usage
                  **${memUsage} MB** Memory Usage` 
        }
      ).setFooter({text: `Shard: ${interaction.guild.shardId} | Cluster: ${client.cluster.id}`})
      interaction.editReply({ embeds: [embed] });
      break;
    }

  } catch (error) {
   console.log("error while running status",error)   
  }
  },
  // devOnly: Boolean,
  //testOnly: true,
  //deleted: true,
};
