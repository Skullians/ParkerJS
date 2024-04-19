const filesUtility = require("./filesUtility");
const path = require("path");

function getButtons(exceptions = []) {
    let buttons = [];
    const files = filesUtility.getFiles(path.join(__dirname, "..", "Buttons"));

    for (const file of files) {
        const obj = require(file);

        if (exceptions.includes(obj.name)) continue;
        buttons.push(obj);
    }

    return buttons;
}

module.exports = { getButtons };