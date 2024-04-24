const ConfigParser = require("../../../Utility/conf/ConfigParser");
const SQLiteHandler = require("../../../Utility/db/SqliteHandler");
const parsingHandler = require("../../../Utility/parsing/parsingHandler");

module.exports = async (client, username, channel, message) => {
    console.log(message)
    if (await SQLiteHandler.isBlacklisted(username)) return;

    let listeningChannels = ConfigParser.getIRCConfig().listening_channels;
    if (!listeningChannels.includes(channel)) return;
    
    console.log(message)
    const data = await parsingHandler.handleIRC(message)
    if (data === null) {

    }
}