const log = require("../../../Utility/logging/ircLogging").loggingManager;

module.exports = async (client, message) => {
    console.log(`[ParkerJS IRC] `.green + `Successfully logged into IRC.`.blue);
    log.log(`Successfully logged into IRC.`)
}