require("colors")
const ConfigParser = require("../conf/ConfigParser");
const BotHandler = require("../init/BotHandler");
const log = require("../logging/generalLogging").loggingManager;

function init() {
    try {
        console.log("[ParkerJS] ".green + "ParkerJS is initialising.");
        
        ConfigParser.loadYAML();
        
        if (ConfigParser.getBotConfig().enabled) {
            BotHandler.init();
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = { init };