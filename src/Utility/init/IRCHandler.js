const ConfigParser = require("../conf/ConfigParser");
const log = require("../logging/ircLogging").loggingManager;
var irc = require("irc")

const ev = require("../../IRC/IRCEventHandler")

function init() {
    const config = ConfigParser.getIRCConfig()

    console.log(`[ParkerJS IRC] `.green + `Initialising IRC Client...`.grey);

    log.log(`Checking IRC Configuration.`)
    const info = checkConfiguration() // check configs while also returning configs

    log.log(`Logging into IRC client and initialising Event Handler.`)
    var client = new irc.Client(info.address, info.userName, {
        userName: info.userName,
        realName: info.realName,
        port: info.port,
        password: info.password,
        debug: info.debug,
        showErrors: true,
        autoRejoin: true,
        autoConnect: true,
        channels: config.listening_channels,
        secure: info.ssl,
        retryCount: info.retryCount,
        retryDelay: info.retryDelay,
        stripColors: true
    })

    console.log(`[ParkerJS IRC] `.green + `Passing IRC Client to eventHandler.`.grey)
    log.log(`Passing IRC Client to eventHandler.`)


    client.addListener('pm', function (nick, text, message) {
        console.log(`${nick} ${text} ${message}`)
    })
    ev(client)
}

function checkConfiguration() {
    var config = ConfigParser.getIRCConfig();
    var connectionDetails = config.Connection;

    const connectionJSON = {
        address: connectionDetails.address,
        port: connectionDetails.port,
        ssl: connectionDetails.ssl,

        userName: connectionDetails.userName,
        realName: connectionDetails.realName,
        password: connectionDetails.password,

        debug: connectionDetails.debug,
        retryCount: connectionDetails.retryCount,
        retryDelay: connectionDetails.retryDelay
    } // kind of janky, but it's a quicker way of finding if any of the values are broken.

    for (const key in connectionJSON) {
        if (connectionJSON[key] === null || connectionJSON[key] === undefined) {
            console.log(`[IRC] IRC connection key [`.red + `${key}`.yellow + `] is null or undefined. Please fix this in the config!`.red)
            log.error(`[IRC] IRC connection key [${key}] is null or undefined. Please fix this in the config!`)
            process.exit();
        }
    }

    return connectionJSON;
}

module.exports = { init }