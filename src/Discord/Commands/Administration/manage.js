const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActivityType } = require("discord.js");
const SQLiteManager = require("../../../Utility/db/SqliteHandler");
const ConfigParser = require("../../../Utility/conf/ConfigParser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("manage-user")
        .setDescription("Manages a user's access to the support system.")
        .addSubcommand((sub) => sub
            .setName("blacklist")
            .setDescription("Blacklists a user from the support system. Any messages / attempts to use the bot will be blocked.")
            .addStringOption((option) => option
                .setName("action")
                .setDescription("Blacklist Action - Whether to add user to blacklist or remove from blacklist.")
                .addChoices(
                    { name: "Add", value: "Add" },
                    { name: "Remove", value: "Remove" }
                )
                .setRequired(true)
            )
            .addUserOption((option) => option
                .setName("user")
                .setDescription("The user to blacklist.")
                .setRequired(true)
            )
        )
        .toJSON(),
    
    userPermissions: [ PermissionFlagsBits.ModerateMembers ],
    botPermissions: [],

    run: async (client, interaction) => {

        const subCommand = interaction.options.getSubcommand();

        await interaction.deferReply({ ephemeral: true });

        switch (subCommand) {
            case "blacklist":
                const action = interaction.options.getString("action")
                const user = interaction.options.getUser("user")

                const embed = new EmbedBuilder();

                if (action === "Add") {

                    if (await SQLiteManager.blacklistUser(user)) {
                        embed
                            .setColor(ConfigParser.getBotConfig().Colors.successColor)
                            .setDescription(`\`✅\` Successfully blacklisted ${user}. They will no longer recieve automated support.`)
                        
                    } else {
                        embed
                            .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                            .setDescription(`\`❗\` This user is already blacklisted!`)
                    }

                    return await interaction.editReply({ embeds: [embed] });
                } else if (action === "Remove") {

                    if (await SQLiteManager.removeBlacklist(user)) {
                        embed
                            .setColor(ConfigParser.getBotConfig().Colors.successColor)
                            .setDescription(`\`✅\` Successfully removed ${user} from the blacklist. They can now recieve automated support.`)

                        return await interaction.editReply({ embeds: [embed] });
                    } else {
                        embed
                            .setColor(ConfigParser.getBotConfig().Colors.errorColor)
                            .setDescription(`\`❗\` That user is not blacklisted!`)
                    }

                    return await interaction.editReply({ embeds: [embed] });
                }
                break;
        }
    }
}