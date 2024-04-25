require("colors")
const ConfigParser = require("../conf/ConfigParser");

const DiscordHandler = require("../init/DiscordHandler");
const IRCHandler = require("../init/IRCHandler");

const log = require("../logging/generalLogging").loggingManager;

function init() {
    try {
        console.log("[ParkerJS] ".green + "ParkerJS is initialising.");
        
        ConfigParser.loadYAML();
        
        if (ConfigParser.getDiscordConfig().enabled) {
            DiscordHandler.init();
        }
        if (ConfigParser.getIRCConfig().enabled) {
            IRCHandler.init()
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = { init };