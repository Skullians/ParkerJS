const discordLogging = require("./discordLogging").loggingManager;
const generalLogging = require("./generalLogging").loggingManager;
const parsingLogging = require("./parsingLogging").loggingManager;

module.exports = () => {
    discordLogging.newSession();
    generalLogging.newSession();
    parsingLogging.newSession();
}

// this is the only way I thought of doing this