const log = require("../logging/discordLogging").loggingManager;

async function getDiscordImageAttachmentURLs(attachments) {
    const urls = [];

    if (attachments !== undefined || attachments.size > 0 || attachments !== null) {
        await Promise.resolve(attachments.forEach(async (attachment) => {
            if (attachment.contentType.startsWith('image')) {
                urls.push(attachment.url);
            }
        }))
    }

    return urls;
}

async function getDiscordTextAttachmentURLs(attachments) {
    const urls = [];

    if (attachments !== undefined || attachments.size > 0 || attachments !== null) {
        await Promise.resolve(attachments.forEach(async (attachment) => {
            if (attachment.contentType.startsWith('text/plain')) {
                urls.push(attachment.url);
            }
        }))
    }

    return urls;
}

module.exports = { getDiscordImageAttachmentURLs, getDiscordTextAttachmentURLs }