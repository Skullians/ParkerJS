require("colors")
const { createWorker } = require("tesseract.js");

async function parseImage(url) {
    try {
        const worker = await createWorker('eng');

        (async () => {
            const { data: { text } } = await worker.recognize(url);
            console.log(text);
            await worker.terminate();
          })();
    } catch (err) {
        console.log(`An unexpected error occurred when trying to parse image from [${url}]!`.red);
        console.log(error);
    }
}

async function parseImagesFromURL(url) {
    const data = [];

    data.push(await parseImage(url));
    return data;
}

module.exports = { parseImage, parseImagesFromURL };