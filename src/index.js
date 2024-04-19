require("colors")
const InitManager = require("./Utility/init/OnStart");
const log = require("./Utility/logging/generalLogging").loggingManager;
const logHead = require("./Utility/logging/loggerHead");

logHead();

log.log("Initialising ParkerJS.")
InitManager.init(); // pretty empty right

log.log("ParkerJS has been initialised!")