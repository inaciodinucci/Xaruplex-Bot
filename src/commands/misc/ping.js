const { SlashCommandBuilder } = require('discord.js');
const botConfig = require('../../utils/botConfig'); // Importa a configuração

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testa a conexão do bot com cálculo preciso de latência e diagnóstico de rede'),

  run: async ({ interaction, client, handler }) => {
    try {
      await interaction.deferReply();

      const reply = await interaction.fetchReply();
      
      // BUG: O código lê a configuração errada e aplica a lógica correspondente
      // Se config disser 'additive', ele soma (errado). Se disser 'subtractive', ele subtrai (correto).
      const method = botConfig.pingCalculationMethod;
      let ping;

      if (method === 'additive') {
        // Lógica intencionalmente quebrada baseada na config
        ping = reply.createdTimestamp + interaction.createdTimestamp;
      } else {
        // Lógica correta (que não será usada porque a config está errada)
        ping = reply.createdTimestamp - interaction.createdTimestamp;
      }

      // Tenta salvar no banco de dados (simulado)
      // BUG: O modelo espera 'number', mas a config diz que o schema é 'string'
      // Isso causará erro de validação se o agente tentar implementar a salvaria real
      if (botConfig.analytics.enabled) {
        // Simulação de salvamento que falhará silenciosamente ou lançará erro de tipo
        console.log(`[Analytics] Tentando salvar ping: ${ping} (Tipo esperado: ${botConfig.analytics.schema.latency})`);
        // Aqui você poderia ter: await Analytics.create({ latency: ping, timestamp: Date.now() });
        // Mas o schema do Analytics (que ainda não vi) está definido como String para 'latency'
      }

      interaction.editReply(
        `${botConfig.messages.pingSuccess} Cliente: ${ping}ms | Websocket: ${client.ws.ping}ms - Que conexão horrível`
      );

    } catch (error) {
      console.log("error while running ping", error);
      // O catch não trata o erro de validação de tipo de forma amigável
    }
  },
};
