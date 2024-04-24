require("colors");

const ConfigParser = require("../conf/ConfigParser");
const log = require("../logging/parsingLogging").loggingManager;

const { fetch } = globalThis;
const axios = require("axios");

async function getSolutions(message, parsedContent) {
    try {
        let responseArray = null; // Starts as null. This is handled further down.
        let reactionsArray = []; // array of reactions depending on the found solutions and its configured reactions if it has any.

        let foundSolutions = 0; // used to compare the amount of found solutions to the configured limit per message.
        const foundSolutionsLimit = ConfigParser.getBotConfig().Settings.analysisLimit; // get the configured limit per message;

        const configuredKeywords = ConfigParser.getSupportConfig().keywords; // get all configured support keywords & their configurations
        const configuredPatterns = ConfigParser.getSupportConfig().regex; // get all configured support regex patterns & their configurations

        let lowerCaseMessage = message.toLowerCase(); // put them into lowercase.
        let lowerCaseContent = parsedContent.toLowerCase();

        // --- TEXT PARSING --- //

        if (configuredKeywords !== undefined && configuredKeywords !== null) { // just in case they didn't configure anything
            for (const keywordData of configuredKeywords) { // start looping through all configured keywords
                if (foundSolutions >= foundSolutionsLimit) break; // if amount of found solutions matches the limit then break. This will repeat for the regex loop too.
    
                let keyword = keywordData.keyword.toLowerCase(); // into lower case
                let reactions = keywordData.reactions; // get array of reactions if configured
                let responses = keywordData.response; // get solutions
    
                if (lowerCaseMessage.includes(keyword) || lowerCaseContent.includes(keyword)) {
                    log.log(`Found keyword [${keyword}] in message / attachments!`)
                    console.log(`[ParkerJS] `.green + `Found keyword [`.blue + `${keyword}`.yellow + `] in message / attachments!`.blue)
    
                    reactionsArray = mergeReactions(reactionsArray, reactions);
                    if (foundSolutions === 0) { // if no solutions have been found before, just chuck the solutions into the array.
                        responseArray = responses.join('\n')
                        continue;
                    }
    
                    // if solutions have been found before, add it in, separating each solution with the configured splitter (default is \n\n\n)
                    responseArray = responseArray + ConfigParser.getBotConfig().Settings.analysisSplit + responses.join(`\n`)
    
                    foundSolutions++; // bump up the found solutions
                    continue;
                }   
            }
        }

        // --- REGEX PARSING --- //
        if (configuredPatterns !== undefined && configuredPatterns !== null) {
            for (const regex of configuredPatterns) { // same as before but looping through the patterns
                if (foundSolutions >= foundSolutionsLimit) break;
    
                let pattern = regex.pattern;
                let reactions = regex.reactions;
                let responses = regex.response;
                
                const regexPattern = new RegExp(pattern); // in the support YAML config, the pattern is originally a string because yaml is a pain, so here we're converting it back into a regex expression.
    
                if (regexPattern.test(lowerCaseMessage) || regexPattern.test(lowerCaseContent)) {
                    log.log(`Found pattern [${pattern}] in message / attachments!`)
                    console.log(`[ParkerJS] `.green + `Found pattern [`.blue + `${pattern}`.yellow + `] in message / attachments!`.blue)
    
                    reactionsArray = mergeReactions(reactionsArray, reactions);
                    if (foundSolutions === 0) {
                        responseArray = responses.join('\n')
                        continue;
                    }
    
                    responseArray = responseArray + ConfigParser.getBotConfig().Settings.analysisSplit + responses.join(`\n`)
    
                    foundSolutions++; // bump up the found solutions
                    continue;
                }
            }
        }

        log.log(`Finished parsing all text and attachments. Returning data.`)
        console.log(`[ParkerJS] `.green + `Finished parsing all text and attachments. Returning data.`.grey)

        if (responseArray === null || responseArray === undefined) return null;
        return formJSONData(responseArray, reactionsArray)

    } catch (error) {
        console.log(`An unexpected error occurred when parsing a message: \n${error}`.red);
        log.error(`An error occurred when parsing a message: ` + error);

        return null;
    }
}

function formJSONData(responses, reactions) { // forms the data for the parser to then respond to.
    const data = { // iirc IRC (and possibly Slack) don't have reaction support so in that case i'll just make it ignore the reactions value
        message: responses,
        reactions: reactions
    }

    return data;
}

function mergeReactions(oldArray, reactions) {
    const newArray = oldArray;
    for (const reaction of reactions) {
        newArray.push(reaction) // basically just combines the old array with the new reactions
    }

    return newArray;
}

async function parseTextFiles(urls) {
    const data = [];

    const textPromises = urls.map(async (url) => {
        const fileContent = await fetch(url);
        if (fileContent.ok) {
            const text = await fileContent.text();
            if (text) {
                data.push(text);
            }
        }
    })
    await Promise.all(textPromises);
    return data;
}

async function getImagesURLsFromContent(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matchedURLs = message.match(urlRegex);
    
    if (matchedURLs === null || matchedURLs === undefined || matchedURLs.length <= 0) return [];
    const urls = [];

    await Promise.all(matchedURLs.map(async (url) => {
        try {
            const response = await axios.head(url);
            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('image')) urls.push(url);
        } catch (error) {
            log.error(`An error occurred when fetching URLs from messages: ${error}`);
            console.log(`An unexpected error occurred when fetching URLs from messages: \n${error}`.red);

            return [];
        }
    }));

    return urls;
}

async function getTextURLsFromContent(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matchedURLs = message.match(urlRegex);
    
    if (matchedURLs === null || matchedURLs === undefined || matchedURLs.length <= 0) return [];
    const urls = [];

    await Promise.all(matchedURLs.map(async (url) => {
        try {
            const response = await axios.head(url);
            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('text/plain')) urls.push(url);
        } catch (error) {
            log.error(`An error occurred when fetching URLs from messages: ${error}`);
            console.log(`An unexpected error occurred when fetching URLs from messages: \n${error}`.red);

            return [];
        }
    }));

    return urls;
}

async function connectArrays(string, array) {
    const joinedArray = array.join(` `)
    string = `${string} ${joinedArray}`
}

module.exports = { getSolutions, getImagesURLsFromContent, parseTextFiles, getTextURLsFromContent }