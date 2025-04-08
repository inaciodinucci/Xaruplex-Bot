const { MongoClient } = require('mongodb');
   
   async function testConnection() {
     console.log("Iniciando teste de conexão com MongoDB...");
     const uri = "mongodb+srv://nanaspiderman08:d1T9JAjvDdJYijwQ@xarubot.c75nrep.mongodb.net/?retryWrites=true&w=majority&appName=Xarubot";
     const client = new MongoClient(uri);
     
     try {
       console.log("Tentando conectar...");
       await client.connect();
       console.log("Conectado com sucesso!");
       return true;
     } catch (error) {
       console.error("Erro de conexão:", error);
       return false;
     } finally {
       await client.close();
     }
   }
   
   testConnection().then(success => {
     if (success) {
       console.log("Teste concluído com sucesso!");
     } else {
       console.log("Teste falhou, verifique os erros acima.");
     }
   });