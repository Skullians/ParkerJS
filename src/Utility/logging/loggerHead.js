const discordLogging = require("./discordLogging").loggingManager;
const generalLogging = require("./generalLogging").loggingManager;
const parsingLogging = require("./parsingLogging").loggingManager;
const debugLogging = require("./debugLogging").loggingManager;

function init() {
    discordLogging.newSession();
    generalLogging.newSession();
    parsingLogging.newSession();
    debugLogging.newSession();
}

function reload() {
    discordLogging.reloadSession();
    generalLogging.reloadSession();
    parsingLogging.reloadSession();
    debugLogging.reloadSession();
}

// this is the only way I thought of doing this

module.exports = { init, reload };