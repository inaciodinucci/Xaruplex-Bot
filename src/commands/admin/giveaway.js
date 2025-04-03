const {Client,Interaction,SlashCommandBuilder,PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const Giveaway = require("../../models/Giveaway");
const ms = require('ms');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Crie um sorteio')
    .addSubcommand((subcommand) => subcommand.setName("create").setDescription("Crie um sorteio")
        .addChannelOption(option => option
          .setName('channel')
          .setDescription('O canal em que você deseja enviar a mensagem do sorteio')
          .addChannelTypes(ChannelType.GuildText).setRequired(true))
            .addNumberOption(option => option
              .setName('winners')
              .setDescription('Quantos ganhadores você deseja que o sorteio tenha.').setRequired(true))
                .addStringOption((option) => option
                  .setName('duration')
                  .setDescription('Quanto tempo o sorteio deve durar, ex: 1h, 2d , 94m , 1w').setRequired(true))
                    .addStringOption(option => option
                      .setName('message')
                      .setDescription('O título do sorteio.').setRequired(true))
                        .addRoleOption((option) => option
                          .setName('required-role')
                           .setDescription('O cargo que o usuário precisa ter para entrar no sorteio')))
    .addSubcommand((subcommand) => subcommand.setName("end").setDescription("Termina um sorteio ativo.")
        .addStringOption(option => option
          .setName('message-id')
          .setDescription('O id da mensagem do sorteio | clique com o botão direito e copie o id da mensagem').setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("reroll").setDescription("Reroll the giveaway winners.")
        .addStringOption(option => option
            .setName('message-id')
            .setDescription('O id da mensagem do sorteio | clique com o botão direito e copie o id da mensagem').setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("view-entries").setDescription("See who entered the giveaway.")
        .addStringOption(option => option
              .setName('message-id')
              .setDescription('The giveaway message id | right click and copy message id').setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("delete").setDescription("delete an active giveaway.")
      .addStringOption(option => option
        .setName('message-id')
        .setDescription('The giveaway message id or link | right click and copy message id').setRequired(true))),

    run: async ({ interaction, client, handler }) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        interaction.reply({content: 'Only server admins can run this comamand', ephemeral: true})
        return;
     }  
     await interaction.deferReply();
     const subcommand = interaction.options.getSubcommand();
    if(!PermissionsBitField.Flags.ManageChannels) return await interaction.editreply({content: 'I do not have manageChannels permission', ephemeral: true})

     if (!interaction.inGuild()) {
      interaction.editReply({
        content: "You can only run this command in a server.",
        ephemeral: true,
      });
     return;
    }
     if (subcommand === 'create' ) {
      const channel = interaction.options.getChannel('channel')
      const winners = interaction.options.get('winners').value
      const duration = interaction.options.getString('duration')
      const message = interaction.options.getString('message')
      const date = new Date();
      const requiredRole = interaction.options.getRole('required-role')?.id || 'null';  
      if (!interaction.guild.members.me?.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) {
        interaction.reply({
          content: "I do not have permiss ons to send messages in that channel",
          ephemeral: true,
        });      
        return;
      }
      const msDuration = ms(duration);
      if (isNaN(msDuration)) {
        await interaction.editReply('Por favor, forneça uma duração de tempo válida.');
        return;
      }
      if (msDuration < 60000 || msDuration > 7.884e+9) {
        await interaction.editReply('O comprimento do sorteio não pode ser menor que 1 minuto ou 3 meses.');
        return;
      }
      const dateWithDuration = new Date(date.getTime() + msDuration)
      const unixTimestamp = Math.floor(dateWithDuration.getTime() / 1000);
      const timestamp = `<t:${unixTimestamp}:R>`;

      const foundChannel = client.channels.cache.get(channel.id);
      const giveawayEmbed = await new EmbedBuilder() 
      .setColor('#e66229')
      .setTitle(message)
      .setDescription(`Ganhadores: ${winners}\nEntradas: 0\n Termina em:${timestamp}`)
      .setFooter({ text: `Clique no botão abaixo para entrar`});
      const giveawayEnterButton = new ButtonBuilder().setCustomId('giveawayEnter').setEmoji('🎉').setStyle(ButtonStyle.Success);
      const row = new ActionRowBuilder().addComponents(giveawayEnterButton);
      const sentMessage = await foundChannel.send({
        embeds: [giveawayEmbed],
        components: [row],
      });
      const link = `https://discordapp.com/channels/${sentMessage.guild.id}/${sentMessage.channel.id}/${sentMessage.id}`;
      await Giveaway.create({
        guildId: interaction.guild.id,
        messageId: sentMessage.id,
        channelId: channel.id,
        messageTitle: message,
        winners: winners,
        requiredRole: requiredRole,  
        giveawayEnd: dateWithDuration,     
       })
      interaction.editReply(`O sorteio foi criado em ${link}`)


    }
     if (subcommand === 'end' ) {
    const currentDate = new Date();
    const messageId = interaction.options.get('message-id').value
    const giveaway = await Giveaway.find({ messageId: messageId, ended: false });
    if (giveaway.length > 0) {
       } else {
        interaction.editReply({
          content: "Esse sorteio não existe ou já terminou",
          ephemeral: true,
        }); 
    return;
    }
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const timestamp = `<t:${unixTimestamp}:R>`;
    const discordIdCount = giveaway[0].entriesArray.length;
    let guild = interaction.guild
    function pickRandomFromArray(array, count) {
      if (!Array.isArray(array)) {
        console.log('The input must be an array.');
      }
    
      const shuffledArray = [...array];
      const selectedElements = [];
    
      while (shuffledArray.length > 0 && count > 0) {
        const randomIndex = Math.floor(Math.random() * shuffledArray.length);
        const selectedElement = shuffledArray.splice(randomIndex, 1)[0];
        selectedElements.push(selectedElement);
    
        count--;
      }
    
      return selectedElements;
    }
    const winners = pickRandomFromArray(giveaway[0].entriesArray, giveaway[0].winners);
    const mentionedWinners = [];
    winners.forEach(winnerId => {
      const mentionedWinner = `<@${winnerId}>`;
      mentionedWinners.push(mentionedWinner);
    });
    const mentionedWinnersString = mentionedWinners.join(' ');
    const giveawayEmbed = new EmbedBuilder()
      .setColor("#e66229")
      .setTitle(giveaway[0].messageTitle)
      .setDescription(
        `Winners: ${mentionedWinnersString}\nEntries: ${discordIdCount}\n Ended: ${timestamp}`
      )
      .setFooter({ text: `/giveaway reroll to reroll` });
    const giveawayEnterButton = new ButtonBuilder()
      .setCustomId("giveawayEnter")
      .setEmoji("🎉")
      .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(giveawayEnterButton);
    if (guild) {
      const channel = guild.channels.cache.get(giveaway[0].channelId);
      const message = await channel.messages.fetch(giveaway[0].messageId);
      message.edit({
        embeds: [giveawayEmbed],
        components: []
      }).catch((err) => {console.log("error while sending message for giveaway enter:", err)});
    }
    giveaway[0].ended = true
    giveaway[0].endedDate = currentDate
    giveaway[0].save();
    interaction.editReply("O sorteio foi encerrado")
    
     }

     if (subcommand === 'reroll' ) {

    const currentDate = new Date();
    const messageId = interaction.options.get('message-id').value
    const giveaway = await Giveaway.find({ messageId: messageId, ended: true });
    if (giveaway.length > 0) {
       } else {
        interaction.editReply({
          content: "Esse sorteio não existe ou não terminou",
          ephemeral: true,
        }); 
    return;
    }
    const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const timestamp = `<t:${unixTimestamp}:R>`;
    const discordIdCount = giveaway[0].entriesArray.length;
    let guild = interaction.guild
    function pickRandomFromArray(array, count) {
      if (!Array.isArray(array)) {
        console.log('The input must be an array.');
      }
    
      const shuffledArray = [...array];
      const selectedElements = [];
    
      while (shuffledArray.length > 0 && count > 0) {
        const randomIndex = Math.floor(Math.random() * shuffledArray.length);
        const selectedElement = shuffledArray.splice(randomIndex, 1)[0];
        selectedElements.push(selectedElement);
    
        count--;
      }
    
      return selectedElements;
    }
    const winners = pickRandomFromArray(giveaway[0].entriesArray, giveaway[0].winners);
    const mentionedWinners = [];
    winners.forEach(winnerId => {
      const mentionedWinner = `<@${winnerId}>`;
      mentionedWinners.push(mentionedWinner);
    });
    const mentionedWinnersString = mentionedWinners.join(' ');
    const giveawayEmbed = new EmbedBuilder()
      .setColor("#e66229")
      .setTitle(giveaway[0].messageTitle)
      .setDescription(
        `Winners: ${mentionedWinnersString}\nEntries: ${discordIdCount}\n Ended: ${timestamp}`
      )
      .setFooter({ text: `/giveaway reroll to reroll` });
    const giveawayEnterButton = new ButtonBuilder()
      .setCustomId("giveawayEnter")
      .setEmoji("🎉")
      .setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(giveawayEnterButton);
    if (guild) {
      const channel = guild.channels.cache.get(giveaway[0].channelId);
      const message = await channel.messages.fetch(giveaway[0].messageId);
      message.edit({
        embeds: [giveawayEmbed],
        components: []
      }).catch((err) => {console.log("error while sending message for giveaway enter:", err)});
    }
    giveaway[0].ended = true
    giveaway[0].endedDate = currentDate
    giveaway[0].save();
    interaction.editReply("O sorteio foi reroladoKKKKKKKKKKKKKK")
    

     }
     if (subcommand === 'view-entries') {
      const messageId = interaction.options.get('message-id').value;
  
      // Fetch the giveaway data
      const giveawayArray = await Giveaway.find({ messageId: messageId });
      if (giveawayArray.length === 0) {
          return interaction.editReply({
              content: "Esse sorteio não existe ou é mais antigo que um mês",
              ephemeral: true,
          });
      }
  
      const giveaway = giveawayArray[0];
      const allEntries = giveaway.entriesArray.map((entry, idx) => `**${idx + 1}.** <@${entry}>`);
      const chunkSize = 10;
      const pages = Math.ceil(allEntries.length / chunkSize);
      const embeds = [];
  
      for (let i = 0; i < pages; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
  
          const embed = new EmbedBuilder()
              .setColor("#e66229")
              .setTitle("Entries")
              .setDescription(allEntries.slice(start, end).join("\n") || "**No entries**")
              .setFooter({ text: `Page ${i + 1} | Total ${giveaway.entriesArray.length} entries` });
  
          embeds.push(embed);
      }
  
      if (embeds.length === 1) {
          return interaction.editReply({
              embeds: [embeds[0]],
          });
      }
  
      const prevButton = new ButtonBuilder()
          .setCustomId("prev")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("⬅️");
  
      const nextButton = new ButtonBuilder()
          .setCustomId("next")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("➡️");
  
      const row = new ActionRowBuilder().addComponents(prevButton, nextButton);
  
      try {
          const message = await interaction.editReply({
              embeds: [embeds[0]],
              components: [row],
              fetchReply: true,
          });
  
          let currentIndex = 0;
          const collector = message.createMessageComponentCollector({ idle: 60000 });
  
          collector.on("collect", async (i) => {
              await i.deferUpdate();
  
              if (i.customId === "prev") {
                  currentIndex = currentIndex === 0 ? embeds.length - 1 : currentIndex - 1;
              } else if (i.customId === "next") {
                  currentIndex = currentIndex === embeds.length - 1 ? 0 : currentIndex + 1;
              }
  
              await interaction.editReply({
                  embeds: [embeds[currentIndex]],
                  components: [row],
              });
          });
  
          collector.on("end", async () => {
              await message.edit({ components: [] });
          });
      } catch (error) {
          console.error('Erro ao editar a mensagem:', error);
          interaction.followUp({
              content: 'Ocorreu um erro ao exibir as entradas. Por favor, tente novamente mais tarde.',
              ephemeral: true,
          });
      }
  }  

     if (subcommand === 'delete' ) {
      const messageId = interaction.options.get('message-id').value;
      const giveawayArray = await Giveaway.find({ messageId: messageId });
      
      if (giveawayArray.length > 0) {
        const giveaway = giveawayArray[0];
        const channel = interaction.guild.channels.cache.get(giveaway.channelId);
        
        try {
          const message = await channel.messages.fetch(giveaway.messageId);
          
          if (!message) {
            try {
              await Giveaway.deleteOne({ _id: giveaway._id });
              interaction.editReply("O sorteio foi deletado da base de dados");
            } catch (error) {
              console.error('Erro ao deletar o sorteio da MongoDB:', error);
            }
          } else {
            await message.delete();
            try {
              await Giveaway.deleteOne({ _id: giveaway._id });
              interaction.editReply("O sorteio foi deletado da base de dados");
            } catch (error) {
              console.error('Erro ao deletar o sorteio da MongoDB:', error);
            }
          }
        } catch (error) {
          try {
            await Giveaway.deleteOne({ _id: giveaway._id });
            interaction.editReply("O sorteio foi deletado da base de dados");
          } catch (error) {
            console.error('Erro ao deletar o sorteio da MongoDB:', error);
          }
        }
      } else {
        interaction.editReply({
          content: "Esse sorteio não existe.",
          ephemeral: true,
        });
      }

    }


    },
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
  };
  