require("colors")
const ConfigParser = require("../conf/ConfigParser");
const log = require("../logging/parsingLogging").loggingManager;
const debuglog = require("../logging/debugLogging").loggingManager;
const { createWorker, createScheduler } = require("tesseract.js");
const { fetch } = globalThis;
const axios = require("axios");

async function parseMessage(message, attachments) {
    try {
        const imageURLData = await Promise.resolve(getImagesFromContent(message));

        console.log(`[ParkerJS] `.green + `Parsing message, attachment(s) URL(s)`.grey)
        log.log(`Parsing message + attachments(s) URL(s)`)
        const grabbedResponses = ConfigParser.getSupportConfig().keywords;

        let responseArray = [];
        let reactionsArray = [];

        // --- IMAGE PARSING PRE --- //


        const parsedText = [
            ...await Promise.resolve(analyseImageAttachments(attachments)),
            ...await Promise.resolve(analyseImageURLs(imageURLData)),
        ]

        // --- TEXT PARSING --- //
        for (const response of grabbedResponses) {

            let keyword = response.keyword.toLowerCase();
            let reactions = response.reactions;
            let responses = response.response;

            let lowerMessage = message.toLowerCase();

            if (lowerMessage.includes(keyword)) {
                log.log(`Found keyword [${keyword}] in message!`)
                reactionsArray = getReactionsArray(reactionsArray, reactions)

                if (responseArray.length === 0) {
                    responseArray.push(responses.join('\n'))
                    continue;
                }
                responseArray.push("\n---------------------------------------------\n");
                responseArray.push(responses.join('\n'))
                continue;
            }


            // --- IMAGE PARSING --- //

            if (parsedText === null || parsedText === undefined || parsedText.length <= 0 || !Array.isArray(parsedText) || parsedText.every((element) => element === undefined)) continue;
            for (let i = 0; i < parsedText.length; i++) {
                const text = parsedText[i];
                if (text === undefined) continue;

                if (text.toLowerCase().includes(keyword)) {
                    log.log(`Found keyword [${keyword}] in image!`)
                    reactionsArray = getReactionsArray(reactionsArray, reactions)

                    if (responseArray.length === 0) {
                        responseArray.push(responses.join('\n'))
                        continue;
                    }

                    responseArray.push("\n---------------------------------------------\n");
                    responseArray.push(responses.join('\n'))
                    continue;
                }
            }
        }

        log.log("Finished parsing all text and images. Returning data.")
        if (responseArray.length === 0 || !Array.isArray(responseArray)) return null;
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

async function getImagesFromContent(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    if (urls === null || urls === undefined || urls.length <= 0) return [];
    const imageURLs = [];

    await Promise.all(urls.map(async (url) => {
        try {
            const response = await axios.head(url);
            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('image')) {
                imageURLs.push(url);
            }
        } catch (error) {
            log.error("An error occurred when fetching and parsing URLs: " + error);
            console.log(`An unexpected error occurred when fetching and parsing URLs: ${error}`)
        }
    }))
    return imageURLs;
}

async function analyseImageAttachments(attachments) {
    const parsedText = [];

    if (attachments !== undefined || attachments.size > 0 || attachments !== null) {
        const scheduler = await createScheduler();

        const workerGen = async () => {
            const worker = await createWorker("eng", 1, { cachePath: ".", logger: m => debuglog.log(JSON.stringify(m)) });
            scheduler.addWorker(worker);
        }
        const jobs = [];
        await Promise.all(attachments.map(async (attachment) => {
            if (attachment.contentType.startsWith('image')) {
                const resArr = Array(4);
                for (let i = 0; i < 4; i++) {
                    resArr[i] = workerGen();
                }
                await Promise.all(resArr);

                jobs.push(scheduler.addJob('recognize', attachment.url).then((x) => {
                    parsedText.push(x.data.text)
                }));

            } else if (attachment.contentType.startsWith('text/plain')) {

                const fileContent = await fetch(attachment.url);
                if (fileContent.ok) {
                    const text = await fileContent.text();
                    if (text) {
                        parsedText.push(text)
                    }
                }
            }
        }))
        await Promise.all(jobs);
        await scheduler.terminate();

        debuglog.log(`Finished parsing ${attachments.size} attachment(s). Proceeding.`)
        console.log(`[ParkerJS] `.green + `Finished parsing [`.grey + `${attachments.size}`.yellow + `] attachment(s). Continuing.`.grey)
        return parsedText;
    }

    return [];
}

async function analyseImageURLs(urls) {
    const parsedText = [];
    if (urls === undefined || urls.length <= 0 || urls === null) return [];

    const scheduler = await createScheduler();
    const workerGen = async () => {
        const worker = await createWorker("eng", 1, { cachePath: ".", logger: m => debuglog.log(JSON.stringify(m)) });
        scheduler.addWorker(worker);
    }

    const jobs = [];

    const resArr = Array(4)
    for (let i = 0; i < 4; i++) {
        resArr[i] = workerGen();
    }
    await Promise.all(resArr);

    await Promise.all(urls.map(async (url) => {
        jobs.push(scheduler.addJob('recognize', url).then((x) => {
            parsedText.push(x.data.text)
        }));
    }))

    await Promise.all(jobs);
    await scheduler.terminate();

    debuglog.log(`Finished parsing ${urls.length} URL(s). Proceeding.`)
    console.log(`[ParkerJS] `.green + `Finished parsing [` + `${urls.length}`.yellow + `] URLs(s). Continuing.`.gray)

    return parsedText;
}

module.exports = { parseMessage }