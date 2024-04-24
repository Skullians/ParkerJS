require("colors")
const yaml = require("js-yaml");
const fs = require("fs");
const log = require("../logging/parsingLogging").loggingManager;

var botconfig = null;
var supportconfig = null;
var parsingconfig = null;
var ircconfig = null;

// --- YAML Loading --- //
function loadYAML() {
    log.log("Loading YAML Configuration files [Discord Config / Support Config]")
    console.log("[ParkerJS] ".green + "Loading YAML Configuration files [ ".grey + "Discord Config / Support Config / Parsing Config / IRC Config".green + " ].".grey)

    botconfig = yaml.load(fs.readFileSync("./src/Configuration/Discord-Configuration/discord.yml", "utf8"));
    supportconfig = yaml.load(fs.readFileSync("./src/Configuration/Support-Configuration/messages.yml", "utf8"));
    parsingconfig = yaml.load(fs.readFileSync("./src/Configuration/Parsing-Configuration/parsing.yml", "utf8"));
    ircconfig = yaml.load(fs.readFileSync("./src/Configuration/IRC-Configuration/irc.yml", "utf8"))

    log.log("Loaded YAML Configuration Files.")
    console.log("[ParkerJS] ".green + "Loaded YAML Configuration files.".grey)
}

// --- Configs --- //

function getBotConfig() {
    return botconfig;
}

function getSupportConfig() {
    return supportconfig;
}

function getParsingConfig() {
    return parsingconfig;
}

function getIRCConfig() {
    return ircconfig;
}

// --- Exports --- //

module.exports = {
    loadYAML,
    getBotConfig,
    getSupportConfig,
    getParsingConfig,
    getIRCConfig
}