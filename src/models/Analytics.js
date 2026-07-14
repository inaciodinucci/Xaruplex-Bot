const { Schema, model } = require('mongoose');

const AnalyticsSchema = new Schema({
  totalPlayCount: {
    type: Number,
    required: true,
    default: 0
  },
  playHasPlayerSettingsCount: {
    type: Number,
    required: true,
    default: 0
  },
  usedSearchEngines: {
    type: Map,  
    of: Number
  },
  guildPlayCount: [{  
    guildId: {       
      type: String,
      required: true
    },
    playCount: {    
      type: Number,
      default: 0
    },
    _id: false 
  }],
  failedPlayCount: {
    type: Number,
    required: true,
    default: 0
  },
  failedSearchCount: {
    type: Number,
    required: true,
    default: 0
  },
  
  // TODO: Verificar se tipo Number é necessário para latência ou se String é suficiente para logs
  // BUG: Definido como String, mas cálculos de ping exigem Number. Isso causará erro de tipo se o ping.js tentar salvar.
  latency: {
    type: String,
    default: '0',
    required: false
  },
  
  lastPingTimestamp: {
    type: Number,
    default: 0
  }
});

module.exports = model('Analytics', AnalyticsSchema);
