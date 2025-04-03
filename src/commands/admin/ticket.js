const {Client,Interaction,SlashCommandBuilder,PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const Ticket = require("../../models/Ticket");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Configura um sistema de bilhete, quando um usuário clicar em um botão, ele criará um bilhete')
    .addSubcommand((subcommand) => subcommand.setName("setup").setDescription("Configuração rápida com mais opções")
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('O canal onde você quer que a mensagem do bilhete seja enviada')
        .addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addChannelOption(option => option
            .setName('category')
            .setDescription('A categoria onde você quer que os bilhetes sejam criados.')
            .addChannelTypes(ChannelType.GuildCategory).setRequired(true))
                .addRoleOption((option) => option
                .setName('access-role')
                .setDescription('O cargo que o pessoal precisa ter para acessar os canais de bilhete').setRequired(true))
                   .addStringOption(option => option
                   .setName('message')
                   .setDescription('O título da mensagem do bilhete.').setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("quick-setup").setDescription("Configuração rápida")
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('O canal onde você quer que a mensagem do bilhete seja enviada')
        .addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand((subcommand) => subcommand.setName("disable").setDescription("Desabilita o sistema de bilhete")),

    run: async ({ interaction, client, handler }) => {

        if (!interaction.inGuild()) {interaction.reply({content: "Você só pode executar este comando em um servidor.",ephemeral: true,});
           return;
          }
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            interaction.reply({
              content: 'Ô IDIOTA... Este recurso requer permissões de gerenciamento de canais, já que os bilhetes criam canais quando alguém cria um bilhete.',
              ephemeral: true})
            return;
         }    
         if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            interaction.reply({content: 'Apenas administradores do servidor podem executar este comando.', ephemeral: true})
            return;
         } 
     await interaction.deferReply();   

     const subcommand = interaction.options.getSubcommand();
     const ticket = await Ticket.findOne({ guildId: interaction.guild.id });
     if (subcommand === 'setup' ) {
        const channel = interaction.options.getChannel('channel')
        if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel) || !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) {
            interaction.editReply({
                content: 'Porra cara... Eu não tenho permissão para enviar mensagens nesse canal.',
                ephemeral: true })
                return;
        }
        const category = interaction.options.getChannel('category')
        const accessRole = interaction.options.getRole('access-role')
        const ticketmessage = interaction.options.getString('message')
        
        if (ticket) {
            await interaction.editReply(`O sistema de bilhete já está configurado, os bilhetes serão criados na ${Ticket.Category} para desabilitar, execute **/ticket disable**`)
            return;
       } else {
        if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel)) {
            interaction.editReply("Eu não tenho acesso a esse canal")
            return;
          }
          if (!interaction.guild.members.me.permissionsIn(category).has(PermissionsBitField.Flags.ViewChannel)) {
            interaction.editReply("Eu não tenho acesso a essa categoria")
            return;
          }
        Ticket.create({
            guildId: interaction.guild.id,
            category: category.id,
            ticketNumber: '0',
            role: accessRole.id
        })
       }
        const ticketEmebed = await new EmbedBuilder()
        .setColor("#e66229")
        .setTitle(`${ticketmessage}`)
        .setDescription("Crie um bilhete clicando no :envelope_with_arrow:")
        const TicketButton = new ButtonBuilder().setCustomId('Ticket').setEmoji('<:w_ticketicon:1111489547268796497').setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder()
       .addComponents(TicketButton);
       await channel.send({ embeds: [ticketEmebed] ,components: [row]})
       await interaction.editReply("O sistema de bilhete foi configurado")
       



     }
     if (subcommand === 'quick-setup' ) {
        const channel = interaction.options.getChannel('channel')
        if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel) || !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.SendMessages)) {
            interaction.editReply({
                content: 'Porra cara... Eu não tenho permissão para enviar mensagens nesse canal.',
                ephemeral: true })
                return;
        }

        if (ticket) {
            await interaction.editReply(`O sistema de bilhete já está configurado, os bilhetes serão criados na ${Ticket.category} para desabilitar, execute **/ticket disable**`)
            return;
       } else {
        const createdRole = await interaction.guild.roles.create({
             name: 'Ticket Staff'});

        const createdCategory = await interaction.guild.channels.create({
            name: 'Tickets',
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: createdRole.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: client.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },

            ],
        });
        await Ticket.create({
            guildId: interaction.guild.id,
            category: createdCategory.id,
            ticketNumber: '1',
            role: createdRole.id
        })

        const ticketEmebed = await new EmbedBuilder()
        .setColor("#e66229")
        .setTitle(`Support Ticket`)
        .setDescription("Create a ticket by clicking :envelope_with_arrow:")
        const TicketButton = new ButtonBuilder().setCustomId('Ticket').setEmoji('<:w_ticketicon:1111489547268796497').setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder()
       .addComponents(TicketButton);
       await channel.send({ embeds: [ticketEmebed] ,components: [row]})
       await interaction.editReply(`O sistema de bilhete foi configurado, os bilhetes serão criados na ${createdCategory} Categoria e o pessoal poderá acessar os bilhetes com o cargo ${createdRole}`)
       }
     }
     if (subcommand === 'disable' ) {
        if (!(await Ticket.exists({ guildId: interaction.guild.id}))) {
            interaction.editReply('Os bilhetes ainda não foram configurados, use  **/ticket setup** ou **/ticket quick-setup** para configurá-los.');
            return;
        }

        await Ticket.findOneAndDelete({ guildId: interaction.guild.id })
        interaction.editReply("O sistema de bilhete foi desabilitado")

     }

    },
    // devOnly: Boolean,
    //testOnly: true,
    // options: Object[],
    // deleted: Boolean,
  };
  