require("colors");

const commandsUtility = require("../../util/commandsUtility");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const log = require("../../../Utility/logging/discordLogging").loggingManager;

module.exports = async (client) => {
    try {
        const locCommands = commandsUtility.getLocalCommands();
        const appCommands = await commandsUtility.getCommands(client, ConfigParser.getBotConfig().guild_id);
        
        for (const command of locCommands) {
            const { data } = command;

            const commandName = data.name;
            const commandDesc = data.description;
            const commandOptions = data.options;

            const exCommand = await appCommands.cache.find((command) => command.name === commandName);

            if (exCommand) {
                if (command.deleted) {
                    await appCommands.delete(exCommand.id);
                    log.log(`Deleted application command ${commandName}.`)
                    console.log(`[ParkerJS] `.green + "Deleted application command [".red + `${commandName}`.yellow + `].`.red);

                    continue;
                }

                if (commandsUtility.compareCommands(exCommand, command)) {
                    await appCommands.edit(exCommand.id, { name: commandName, description: commandDesc, options: commandOptions });

                    log.log(`Edited application command ${commandName}.`)
                    console.log(`[ParkerJS] `.green + "Edited application command [".gray + `${commandName}`.yellow + `].`.gray);
                } else {
                    if (command.deleted) {
                        log.log(`Skipped application command ${commandName} as it has been set to deleted.`)
                        continue;
                    }

                    await appCommands.create({ name: commandName, description: commandDesc, options: commandOptions });
                    log.log("[ParkerJS] ".green + `Registered application command [`.yellow + `${commandName}`.green + `].`.yellow)

                    console.log("[ParkerJS] ".green + `Registered application command [`.yellow + `${commandName}`.green + `].`.yellow);
                }
            }
        }
    } catch (err) {
        console.log("[ParkerJS] ".green + `An unexpected occurred when registering commands: ${err}`.red);
        log.error("COMMAND REG: " + err);
    }
}