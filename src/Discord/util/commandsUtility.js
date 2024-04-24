
const filesUtility = require("../../Utility/files/filesUtility");
const path = require("path");

// --- Functions --- //

function compareCommands(existing, local) {
    const hasChanged = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

    if (hasChanged(existing.name, local.data.name) || hasChanged(existing.description || undefined, local.data.description || undefined)) return true;

    const changedOptions = hasChanged(
        optionsArray(existing),
        optionsArray(local.data)
    );

    return changedOptions;

    function optionsArray(command) {
        const clean = (object) => {
            for (const key in object) {

                if (typeof object[key] === "object") {
                    clean(object[key]);
                    if (!object[key] || Array.isArray(object[key]) && !object[key].length) delete object[key];
                } else if (object[key] === undefined) delete object[key];

            }
        }

        const norm = (stream) => {
            if (Array.isArray(stream)) {
                return stream.map((item) => norm(item));
            }

            const normItem = {
                type: stream.type,
                name: stream.name,
                description: stream.description,
                options: stream.options ? norm(stream.options) : undefined,
                required: stream.required,
            }

            return normItem;
        }

        return (command.options || []).map((option) => {
            let opt = JSON.parse(JSON.stringify(option));
            opt.options ? (opt.options = norm(opt.options)) : (opt = norm(opt));
            clean(opt);

            return {...opt, choices: opt.choices ? strChoices(opt.choices) : null};
        })

        function strChoices(choices) { return JSON.stringify(choices.map((choice) => choice.value ))};
    }
}

async function getCommands(client, id) {
    let commands;

    if (id) {
        const guild = await client.guilds.fetch(id);
        commands = guild.commands;
    } else {
        commands = await client.application.commands;
    }

    await commands.fetch();
    return commands;
}

function getLocalCommands(exceptions = []) {
    let commands = [];
    const categories = filesUtility(path.join(__dirname, "..", "Commands"), true);

    for (const category of categories) {
        const files = filesUtility(category);

        for (const file of files) {
            const obj = require(file);

            if (exceptions.includes(obj.name)) continue;
            commands.push(obj);
        }
    }

    return commands;
}

// --- Exports --- //

module.exports = { compareCommands, getCommands, getLocalCommands };