require("colors");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const SQLiteHandler = require("../../../Utility/db/SqliteHandler");
const parsingHandler = require("../../../Utility/parsing/parsingHandler");


module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (await SQLiteHandler.isBlacklisted(message.member.id)) return;

    let listeningChannels = ConfigParser.getDiscordConfig().listening_channels;
    if (!listeningChannels.includes(message.channel.id)) return;
    
    const data= await parsingHandler.handleDiscord(message.content, message.attachments);
    if (data === null) {
        console.log(`[ParkerJS Discord] `.green + `Did not match any keywords / phrases / patterns with message or attachments. Checking for mention.`.gray)
        return hasMentioned(message, client)
    }
    
    message.reply({ content: data.message })
    data.reactions.forEach((reaction) => {
        message.react(reaction);
    })




}

function hasMentioned(message, client) {
    if (message.mentions.has(client.user)) {
        const mentionData = ConfigParser.getSupportConfig().mentions.mention;
        mentionData.reactions.forEach((reaction) => {
            message.react(reaction);
        })
    }
}