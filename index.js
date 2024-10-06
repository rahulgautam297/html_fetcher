const fetchPage = require('./fetch').fetchPage;

(() => {
    let showMetadata = false;
    let urls = process?.argv?.slice(2);
    if (urls?.[0] == 'metadata') {
        showMetadata = true;
        urls = urls.slice(1);
    }
    urls.forEach((currentUrl) => {
        fetchPage(currentUrl, showMetadata);
    })
})();
