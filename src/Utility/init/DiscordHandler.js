const { Client, GatewayIntentBits, Events, EmbedBuilder } = require("discord.js");
const eventHandler = require("../../Discord/discordEventHandler");
const ConfigParser = require("../conf/ConfigParser");
const log = require("../logging/discordLogging").loggingManager;

// --- Discord Init --- //

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

function init() {
    console.log("[ParkerJS] ".green + "Initialising Discord Bot...".grey);
    
    log.log("Checking Discord Bot Token.")
    checkToken();

    log.log("Logging in Discord Bot and initialising Event Handler.")
    eventHandler(client);
    client.login(ConfigParser.getBotConfig().bot_token);
}


// --- Checks --- //

function checkToken() {
    if (ConfigParser.getBotConfig().bot_token === "" || ConfigParser.getBotConfig().bot_token === null || ConfigParser.getBotConfig().bot_token === undefined) {
        log.error("[Discord] Discord Bot token is empty or null! Please fix this in the config.")
        console.error("[Discord] Token is empty or null! Please rectify this in the config.".red);
        process.exit();
    }
}

// --- Exports --- //

module.exports = { init };