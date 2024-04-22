const ConfigParser = require("../conf/ConfigParser");

const log = require("../logging/parsingLogging").loggingManager; // parsing logging, basic logs go here
const debuglog = require("../logging/debugLogging").loggingManager; // where all tesseract stuff goes

require("colors")

const { createWorker, createScheduler } = require("tesseract.js");

async function analyseImageURLs(urls) { // array of URLs. Will occur after direct attachment URLs / message embedded URLs are retrieved and condensed.
    const text = []; // empty array to start with

    if (urls !== undefined || !urls.length <= 0 || urls !== null) { // sanity checks. probably not needed.
        const jobs = []; // array of all pending image parsing jobs for tesseract.

        const scheduler = await createScheduler(); // create scheduler for tesseract parsing

        const workerGen = async () => {
            const worker = await createWorker(
                'eng', // english lang
                1,
                {
                    cachePath: ".", // path for caching
                    logger: message => debuglog.log(JSON.stringify(message)) // set logger to log stringify all JSON logs and output to debug.log
                }
            )
            scheduler.addWorker(worker); // add to scheduler
        }

        const workerCount = ConfigParser.getParsingConfig().parsing.worker_count; // Get configured amount of workers.
        const resArr = Array(workerCount);
        for (let i = 0; i < workerCount; i++) {
            resArr[i] = workerGen()
        }
        await Promise.all(resArr);

        const resArr2 = Array(urls.length);
        await Promise.all(urls.map(async (url) => {
            jobs.push(scheduler.addJob('recognize', url).then((x) => { // schedule a text parsing ('recognize') job.
                text.push(x.data.text)
            }))
        }))
        await Promise.all(jobs); // wait for all jobs to finish
        await scheduler.terminate(); // terminate the scheduler and its workers

        log.log(`Finished parsing ${urls.length} attachment(s). Proceeding.`);
        console.log(`[ParkerJS] `.green + `Finished parsing [`.grey + `${urls.length}`.yellow + `] attachment(s). Continuing.`.grey)
    } else return null;

    return text;
}

module.exports = { analyseImageURLs }