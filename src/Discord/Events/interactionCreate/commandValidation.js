require("colors");

const { EmbedBuilder } = require("discord.js");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const commandsUtility = require("../../util/commandsUtility");
const log = require("../../../Utility/logging/discordLogging").loggingManager;

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const locCommands = commandsUtility.getLocalCommands();

    try {
        const obj = locCommands.find((command) => command.data.name === interaction.commandName);
        if (!obj) return;

        if (obj.userPermissions?.length) {
            for (const permission of obj.userPermissions) {
                if (interaction.member.permissions.has(permission)) continue;

                log.log(`${interaction.user.username} tried to run the command ${interaction.commandName} but didn't have the correct permissions.`)

                const embed = new EmbedBuilder()
                    .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                    .setDescription(ConfigParser.getBotConfig().Messages.noPermissions)
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        if (obj.botPermissions?.length) {
            for (const permission of obj.userPermissions) {
                const bot = interaction.guild.members.me;
                if (bot.permissions.has(permission)) continue;

                log.error(`I don't have the permissions to run the command ${interaction.commandName}! All Required Permissions:\n` + obj.botPermissions);

                const embed = new EmbedBuilder()
                    .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                    .setDescription(ConfigParser.getBotConfig().Messages.botNoPermissions)
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        await obj.run(client, interaction);
    } catch (error) {
        log.error("[COMMAND VALIDATOR] An error occurred when validating commands: " + error);
        
        console.log(`[ParkerJS] `.green + `An unexpected error occured when validating commands: \n${error}`.red);
    }
}