require("colors");

const { EmbedBuilder } = require("discord.js");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const buttonsUtility = require("../../util/buttonsUtility");
const log = require("../../../Utility/logging/discordLogging").loggingManager;

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    const buttons = buttonsUtility.getButtons();

    try {
        const obj = buttons.find((button) => button.customId === interaction.customId);
        if (!obj) return;
        
        if (obj.userPermissions?.length) {
            for (const permission of obj.userPermissions) {
                if (interaction.member.permissions.has(permission)) continue;

                log.log(`${interaction.user.username} tried to use the button ${interaction.customId} but didn't have the correct permissions.`)

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

                log.error(`I don't have the permissions to execute this button! ${interaction.customId}! All Required Permissions:\n` + obj.botPermissions);

                const embed = new EmbedBuilder()
                    .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                    .setDescription(ConfigParser.getBotConfig().Messages.botNoPermissions)
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        if (interaction.message.interaction) {
            if (interaction.message.interaction.user.id !== interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                    .setDescription(ConfigParser.getBotConfig().Messages.notYourButton)
                
                log.info(`${interaction.user.username} tried to use a button that did not belong to them!\nOriginal owner: [${interaction.message.interaction.user.id}].`)

                return await interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }

        await obj.run(client, interaction);
    } catch (error) {
        log.error("[DISCORD BUTTON VALIDATOR] An error occurred when validating buttons: " + error);
        
        console.log(`An unexpected error occured when validating Discord buttons: \n${error}`.red);
    }
}