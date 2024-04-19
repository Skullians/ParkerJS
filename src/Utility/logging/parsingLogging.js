require("colors")
const fs = require("fs");
const path = require("path");

const logFilePath = "./src/Logs/parsing.log"

const loggingManager = {
    log: function (message) {
        const logMessage = `${new Date().toISOString()} - INFO: ${message}\n`;
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.log(`[ParkerJS] `.green + ` An unexpected error occurred when writing to log file [parsing.log]: `, err);
            }
        })
    },

    error: function (errorMessage) {
        const errorLogMessage = `\n------------------------- ERROR -------------------------\n${new Date().toISOString()} - ${errorMessage}\n------------------------- ERROR -------------------------\n\n`;
        fs.appendFile(logFilePath, errorLogMessage, (err) => {
            if (err) {
                console.log(`[ParkerJS] `.green + ` An unexpected error occurred when writing to log file [parsing.log]: `, err);
            }
        })
    },

    newSession: function () {
        fs.appendFile(logFilePath, "\n------------------------- NEW SESSION -------------------------\n", (err) => {
            if (err) {
                console.log(`[ParkerJS] `.green + ` An unexpected error occurred when writing to log file [parsing.log]: `, err);
            }
        })
    }
}
module.exports = { loggingManager };