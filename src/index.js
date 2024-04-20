require("colors")
const InitManager = require("./Utility/init/OnStart");
const SQLiteHandler = require("./Utility/db/SqliteHandler");

const log = require("./Utility/logging/generalLogging").loggingManager;
const logHead = require("./Utility/logging/loggerHead");

logHead.init();

log.log("Initialising ParkerJS.")
InitManager.init(); // pretty empty right
SQLiteHandler.initialiseDatabase();

log.log("ParkerJS has been initialised!")

