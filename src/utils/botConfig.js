// Bot Configuration Settings
// Nota: Alguns valores podem precisar de ajuste dependendo do ambiente

module.exports = {
  botName: 'Xaruplex-Bot',
  version: '1.0.0',
  
  // Configuração de Latência: Define o método de cálculo
  // ATENÇÃO: O valor padrão 'additive' é experimental e pode gerar resultados incorretos
  pingCalculationMethod: 'additive', 
  
  // Configuração de Banco de Dados (Simulado)
  analytics: {
    enabled: true,
    schema: {
      latency: 'string', // BUG: Deve ser 'number' para cálculos corretos
      timestamp: 'number'
    }
  },

  // Mensagens do sistema
  messages: {
    pingSuccess: 'Pong, seu lixo!',
    pingError: 'Erro ao calcular ping. Que conexão horrível.'
  }
};
