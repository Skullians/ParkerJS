require("colors")
const ConfigParser = require("../conf/ConfigParser");
const log = require("../logging/parsingLogging").loggingManager;
const debuglog = require("../logging/debugLogging").loggingManager;
const { createWorker, createScheduler } = require("tesseract.js");
const { fetch } = globalThis;
const axios = require("axios");

const imageParser = require("./imageParser");


async function parseMessage(message, attachments) {
    try {
        console.log(`[ParkerJS] `.green + `Parsing message, attachment(s) URL(s)`.grey)
        log.log(`Parsing message + attachments(s) URL(s)`)
        const grabbedResponses = ConfigParser.getSupportConfig().keywords;
        const grabbedRegex = ConfigParser.getSupportConfig().regex;

        let responseArray = "";
        let reactionsArray = [];

        let sc = 0;
        const analysisLimit = ConfigParser.getBotConfig().Settings.analysisLimit;

        
        // --- IMAGE PARSING PRE --- //
        const imageURLData = await Promise.resolve(imageParser.getImagesFromContent(message));

        const parsedText = [
            ...await Promise.resolve(imageParser.analyseImageAttachments(attachments)),
            ...await Promise.resolve(imageParser.analyseImageURLs(imageURLData)),
        ]

        // --- TEXT PARSING --- //
        for (const response of grabbedResponses) {

            if (sc >= analysisLimit) break;
            
            let keyword = response.keyword.toLowerCase();
            let reactions = response.reactions;
            let responses = response.response;

            let lowerMessage = message.toLowerCase();

            if (lowerMessage.includes(keyword)) {
                sc++;

                log.log(`Found keyword [${keyword}] in message!`)
                reactionsArray = getReactionsArray(reactionsArray, reactions)

                if (responseArray === "") {
                    responseArray = responseArray + responses.join('\n')
                    continue;
                }

                responseArray = responseArray + ConfigParser.getBotConfig().Settings.analysisSplit + responses.join('\n')
                continue;
            }


            // --- IMAGE PARSING --- //

            for (let i = 0; i < parsedText.length; i++) {
                const text = parsedText[i];
                if (text === undefined) continue;

                if (text.toLowerCase().includes(keyword)) {
                    sc++;
                    log.log(`Found keyword [${keyword}] in image!`)
                    reactionsArray = getReactionsArray(reactionsArray, reactions)

                    if (responseArray === "") {
                        responseArray = responseArray + responses.join('\n')
                        continue;
                    }
                    
                    responseArray = responseArray + ConfigParser.getBotConfig().Settings.analysisSplit + responses.join('\n')
                    continue;
                }
            }
        }

        // --- REGEX PARSING --- //

        for (const regex of grabbedRegex) {
            if (sc >= analysisLimit) break;

            let pattern = regex.pattern;
            let reactions = regex.reactions;
            let responses = regex.response;

            const regexPattern = new RegExp(pattern);
            
            if (regexPattern.test(message) || regexPattern.test(message.toLowerCase())) {
                log.log(`Found pattern [${pattern}] in message!`)
                reactionsArray = getReactionsArray(reactionsArray, reactions);

                if (responseArray === "") {
                    responseArray = responseArray + responses.join('\n');
                    continue;
                }

                responseArray = responseArray + ConfigParser.getBotConfig().Settings.analysisSplit + responses.join('\n');
                continue;
            }
        }

        log.log("Finished parsing all text and images. Returning data.")

        if (responseArray === null || responseArray === undefined || responseArray === "") return null;
        return formJSONData(responseArray, reactionsArray)
    } catch (error) {
        log.error("An error occurred when parsing a message: " + error);
        debuglog.error("An error occurred when parsing a message: " + error)

        console.log(`An unexpected error occurred when parsing a message: \n${error}`);
    }
}

function formJSONData(responses, reactions) {
    const data = {
        message: responses,
        reactions: reactions
    }

    return data;
}

function getReactionsArray(oldArray, reactions) {
    const newArray = oldArray;
    for (const reaction of reactions) {
        newArray.push(reaction)
    }

    return newArray;
}
module.exports = { parseMessage }