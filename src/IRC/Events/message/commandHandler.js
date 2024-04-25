const ConfigParser = require("../../../Utility/conf/ConfigParser");
const SQLiteHandler = require("../../../Utility/db/SqliteHandler");
const log = require("../../../Utility/logging/ircLogging").loggingManager;
const loggerHead = require("../../../Utility/logging/loggerHead");

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

module.exports = async (client, username, channel, message) => {

    const prefix = ConfigParser.getIRCConfig().Connection.prefix;
    if (message.startsWith(`${prefix}reload`)) {
        client.say(channel, `🔄️ Reloading Configs, please wait...`);

        await delay(1000);
        ConfigParser.loadYAML();
        loggerHead.reload();

        client.say(channel, `✅ Bot reloaded.\nThis reload mainly applies to the support config.`)
    } else {
        const regex = /^;blacklist (add|remove) (\w+)/;
        const match = message.match(regex);

        if (match) {
            const operation = match[1];
            const name = match[2];

            if (operation === 'add') {
                if (await SQLiteHandler.blacklistUser(name)) {
                    client.say(channel, `${username}:\nSuccessfully blackisted ${name} from receiving support.`)
                } else {
                    client.say(channel, `${username}:\n${name} is already blacklisted!`)
                }
            } else if (operation === 'remove') {
                if (await SQLiteHandler.removeBlacklist(name)) {
                    client.say(channel, `${username}:\nSuccessfully removed ${name} from the blacklist. They can now receive automated support.`)
                } else {
                    client.say(channel, `${username}:\n${name} is not blacklisted!`)
                }
            }
        }
    }
}
