const textUtility = require("./textUtil");
const discordHandler = require("./discordHandler");
const imageHandler = require("./imageHandler");

async function handleDiscord(message, attachments) {
    const imageURLs = [
        ...await Promise.resolve(discordHandler.getDiscordImageAttachmentURLs(attachments)),
        ...await Promise.resolve(textUtility.getImagesURLsFromContent(message))
    ];

    const textURLs = [
        ...await Promise.resolve(discordHandler.getDiscordTextAttachmentURLs(attachments)),
        ...await Promise.resolve(textUtility.getTextURLsFromContent(message)),
    ] // i could condense the image parsing and text parsing into a single array but it's just easier to manage for me imo

    const parsedText = [
        ...await Promise.resolve(textUtility.parseTextFiles(textURLs)),
        ...await Promise.resolve(imageHandler.analyseImageURLs(imageURLs))
    ]

    const data = textUtility.getSolutions(
        message,
        parsedText.join(' ')
    )

    return data;
}

async function handleIRC(message) {
    const imageURLs = await Promise.resolve(textUtility.getImagesURLsFromContent(message))
    const textURLs = await Promise.resolve(textUtility.getTextURLsFromContent(message))

    const parsedText = [
        ...await Promise.resolve(textUtility.parseTextFiles(textURLs)),
        ...await Promise.resolve(imageHandler.analyseImageURLs(imageURLs))
    ]
    const data = textUtility.getSolutions(
        message,
        parsedText.join(' ')
    )

    return data;
}

module.exports = { handleDiscord, handleIRC }