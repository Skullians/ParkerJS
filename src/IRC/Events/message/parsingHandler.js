const ConfigParser = require("../../../Utility/conf/ConfigParser");
const SQLiteHandler = require("../../../Utility/db/SqliteHandler");
const parsingHandler = require("../../../Utility/parsing/parsingHandler");
const log = require("../../../Utility/logging/ircLogging").loggingManager;

module.exports = async (client, username, channel, message) => {
    if (await SQLiteHandler.isBlacklisted(username)) return;

    let listeningChannels = ConfigParser.getIRCConfig().listening_channels;
    if (!listeningChannels.includes(channel)) return;
    
    const data = await parsingHandler.handleIRC(message)
    if (data === null) {
        console.log(`[ParkerJS IRC] `.green + `Did not match any keywords / phrases / patterns with messages or links. Checking for mention.`.gray)
        return hasMentioned(client, username, channel, message)
    }

    client.say(channel, `@${username}\n` + data.message)
}

function hasMentioned(client, username, channel, message) {
    const userName = ConfigParser.getIRCConfig().Connection.userName;
    const realName = ConfigParser.getIRCConfig().Connection.realName;

    if (message.includes(userName) || message.includes(realName)) {
        console.log(`[ParkerJS IRC] `.green + `Mention found, replying with configured response.`.grey);
        log.log(`Mention found,`.yellow + ` responding with configured response.`)
        const mentionData = ConfigParser.getSupportConfig().mentions.mention;
        
        client.say(channel, `@${username}\n` + mentionData.responses.join('\n'))
    }
}