require("colors");
const parsingMain = require("../../../Utility/parsing/parsingMain");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const SQLiteHandler = require("../../../Utility/db/SqliteHandler");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (await SQLiteHandler.isBlacklisted(message.member.id)) return;

    let listeningChannels = ConfigParser.getBotConfig().listening_channels;
    if (!listeningChannels.includes(message.channel.id)) return;

    const data = await parsingMain.parseMessage(message.content, message.attachments);
    if (data === null) {
        return hasMentioned(message, client)
    }
    
    message.reply({ content: data.message[0] })
    data.reactions.forEach((reaction) => {
        message.react(reaction);
    })


}

function hasMentioned(message, client) {
    if (message.mentions.has(client.user)) {
        ConfigParser.getSupportConfig().mentions.mention.reactions.forEach((reaction) => {
            message.react(reaction)
        })
    }
}