const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits , SlashCommandBuilder,PermissionsBitField} = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('Quando um usuário se junta, ele receberá um cargo.')
    .addSubcommand((subcommand) => subcommand.setName("disable").setDescription("Desabilita o autorole"))
    .addSubcommand((subcommand) => subcommand.setName("role").setDescription("O cargo que os usuários receberão ao se juntarem").addRoleOption((option) => option
    .setName('role').setDescription('O cargo que você quer que os usuários recebam ao se juntarem').setRequired(true))),

    
  run: async ({client, interaction})  => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      interaction.reply({content: 'Only server admins can run this comamand', ephemeral: true})
      return;
   }    
    const subcommand = interaction.options.getSubcommand();
    
    if (!interaction.inGuild()) {
        interaction.reply({
          content: "Você só pode executar este comando em um servidor.",
          ephemeral: true,
        });
        return;
      } 
      if (subcommand === 'role' ) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
          interaction.reply({content: 'Ô idiota... Este recurso requer permissões de gerenciamento de cargos, já que os autoroles dão um cargo ao usuário quando eles se juntam.', ephemeral: true})
          return;
       }    
        const targetRoleId = interaction.options.get('role').value;
        const targetRole = interaction.guild.roles.cache.get(targetRoleId)

        try {
          let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });
          
          if (autoRole) {
            if (autoRole.roleId === targetRoleId) {
              interaction.reply('Autorole já foi configurado para esse cargo. Para desabilitar, execute `/autorole disable`');
              return;
            }
          } else {
            autoRole = new AutoRole({
              guildId: interaction.guild.id,
              roleId: targetRoleId,
            });
          }
    
          await autoRole.save();
          const targetRolePosition = targetRole.position;
          const botRolePosition = interaction.guild.members.me.roles.highest.position; 

          if (targetRolePosition >= botRolePosition) {
            interaction.reply(`Autorole foi habilitado mas você precisa mover o cargo do bot acima de ${targetRole} para que ele funcione. Para desabilitar, execute \`/autorole disable\``);
            return;
          }
          if (autoRole) {
            interaction.reply(`Autorole foi atualizado para ${targetRole}KKKKKKKKKKKK. Para desabilitar, execute \`/autorole disable\``);
            autoRole.roleId = targetRoleId
            await autoRole.save();
            return;
          } else {
            interaction.reply(`Autorole foi configurado agora para ${targetRole}KKKKKKKKKKKK. Para desabilitar, execute \`/autorole disable\``);
          }
        } catch (error) {
          console.log(error);
        }
    }
    if (subcommand === 'disable') {
        try {
            if (!(await AutoRole.exists({ guildId: interaction.guild.id}))) {
                interaction.reply('Autorole não foi configurado para este servidor. Use `/autorole role` para configurá-lo.');
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id })
            interaction.reply("Auto role has been disabled")
        } catch (error) {
            console.log(error)
        }

    }
},
  // devOnly: Boolean,
  //testOnly: true,
  // options: Object[],
  // deleted: Boolean,
};