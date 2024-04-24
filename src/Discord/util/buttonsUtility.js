const getFiles = require("../../Utility/files/filesUtility");
const path = require("path");

function getButtons(exceptions = []) {
    let buttons = [];
    const files = getFiles(path.join(__dirname, "..", "Buttons"));

    for (const file of files) {
        const obj = require(file);

        if (exceptions.includes(obj.name)) continue;
        buttons.push(obj);
    }

    return buttons;
}

module.exports = { getButtons };