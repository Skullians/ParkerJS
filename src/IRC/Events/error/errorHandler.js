const log = require("../../../Utility/logging/ircLogging").loggingManager;
module.exports = async (client, message) => {
    console.log(`An unexpected error occurred with the IRC Client: \n${message}`.red);
    log.error(`An error occurred: ${message}`)
}