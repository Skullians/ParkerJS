const path = require("path");
const getFiles = require("../Utility/files/filesUtility");
const log = require("../Utility/logging/discordLogging").loggingManager;

module.exports = (client) => {
    const folders = getFiles(__dirname + "/Events", true); // get all folders in events

    for (const folder of folders) { // run through folders
        const files = getFiles(folder); // get files inside
        let name;
        name = folder.replace(/\\/g, "/").split("/").pop(); // get the name of the folder, which is the event name

        for (const file of files) { // run through folder's names
            console.log(file)
            client.addListener(name, function(...args) { // register them as a listener.
                require(file)(client, ...args)
            })
        }
    };
};