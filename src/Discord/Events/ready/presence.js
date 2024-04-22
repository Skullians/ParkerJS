require("colors");
const ConfigParser = require("../../../Utility/conf/ConfigParser");
const log = require("../../../Utility/logging/discordLogging").loggingManager;
const { ActivityType } = require("discord.js")

let currentPresenceIndex = 0;

module.exports = async (client) => {
    console.log(`[ParkerJS] `.green + `${client.user.username} is online.`.blue);

    const presences = ConfigParser.getBotConfig().Presence.presences;
    const interval = ConfigParser.getBotConfig().Presence.rotateInterval;

    await client.user.setPresence({
        activities: [{ name: presences[currentPresenceIndex].presence, type: activityTypes(presences[currentPresenceIndex].type) }],
        status: presences[0].status
    })
    currentPresenceIndex = (currentPresenceIndex + 1) % presences.length;
    setInterval(() => updatePresence(presences, client), interval)
}

async function updatePresence(presences, client) {
    const { presence, type, status } = presences[currentPresenceIndex];
    await client.user.setPresence({
        activities: [{ name: presence, type: activityTypes(type) }],
        status: status
    })
    log.log(`Rotated Discord Presence to [${type} ${presence}].`)

    currentPresenceIndex = (currentPresenceIndex + 1) % presences.length;
}

function activityTypes(type) {
    switch (type.toLowerCase()) {
        case 'playing':
            return ActivityType.PLAYING;
        case 'streaming':
            return ActivityType.STREAMING;
        case 'listening':
            return ActivityType.LISTENING;
        case 'watching':
            return ActivityType.WATCHING;
        default:
            return ActivityType.PLAYING; // Default to PLAYING if the type is not recognized
    }
}