const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

exports.fetchPage = async function fetchPage(url, showMetadata) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const hostname = new URL(url)?.hostname;
        if (showMetadata) {
            console.log("Number of link tags", $('a').length);
            console.log("Number of image tags", $('img').length);
        }

        const outputDir = path.resolve(__dirname, hostname);
        fs.ensureDirSync(outputDir);

        const lastFetchTimeFile = path.join(outputDir, "last_fetch");
        const filePath = path.join(outputDir, `${hostname}.html`);
        
        if (fs.existsSync(lastFetchTimeFile)) {
            if (showMetadata)
                console.log("Document fetched last time." +
                 new Date(fs.readFileSync(lastFetchTimeFile)));
        } else {
            console.log("Document is being fetched for the first time.");   
        }

        fs.writeFileSync(lastFetchTimeFile, new Date().toISOString());
        fs.writeFileSync(filePath, html);

    } catch (error) {
        console.error(`Error fetching page: ${error.message}`);
    }
}