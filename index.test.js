const axios = require('axios');
const axiosMock = require('axios-mock-adapter');
const fs = require('fs-extra');
const path = require('path');
const fetchPage = require('./fetch').fetchPage;

const mock = new axiosMock(axios);

describe('fetchPage Function', () => {
    const url = 'https://example.com';
    const hostname = new URL(url)?.hostname;
    const outputDir = path.resolve(__dirname, hostname);

    afterEach(() => {
        fs.removeSync(outputDir);
    });

    test('should fetch and save the HTML file and log metadata', async () => {
        const mockHtml = `
            <html>
                <body>
                    <img src="image1.jpg" />
                    <a href="https://example.com">Link</a>
                    <script src="script.js"></script>
                </body>
            </html>
        `;
        mock.onGet('https://example.com').reply(200, mockHtml);

        await fetchPage(url, true);
        fs.ensureDirSync(outputDir, false);

        const savedHtmlPath = path.join(outputDir, `${hostname}.html`);
        expect(fs.existsSync(savedHtmlPath)).toBe(true);

        const savedHtml = fs.readFileSync(savedHtmlPath, 'utf-8');
        expect(savedHtml).toContain('<img src="image1.jpg" />');
        expect(savedHtml).toContain('<script src="script.js"></script>');
    });

    test('should throw an error', async () => {
        const mockHtml = `
            <html>
                <body>
                    <img src="image1.jpg" />
                    <a href="https://example.com">Link</a>
                    <script src="script.js"></script>
                </body>
            </html>
        `;
        mock.onGet('https://example.com').reply(500, mockHtml);
        expect(await fetchPage(url)).toBe(undefined);
    });
});
