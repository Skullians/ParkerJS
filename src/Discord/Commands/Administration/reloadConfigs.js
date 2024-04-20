const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const log = require("../../../Utility/logging/generalLogging").loggingManager;
const loggerHead = require("../../../Utility/logging/loggerHead");

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot, the configs, etc.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    userPermissions: [ PermissionFlagsBits.ManageGuild ],
    botPermissions: [],

    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply({ content: `\`🔃\` Reloading Configs, please wait... `});

        await delay(1000);
        ConfigParser.loadYAML();
        loggerHead.reload();

        await interaction.editReply({ content: `✅ Bot reloaded.`})
    }
}