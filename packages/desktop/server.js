import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 1. Import this
import { WebSocketServer } from 'ws';
import { displayWelcomeBanner, displayWelcomeMessage } from './ui/termnial.js';
import { updatePdfPreview } from './updatePdfPreview.js';
import { initCache } from './initCache.js';
import { renderMarkdown } from '../core/src/markdown/iframeHtml.js';

// import { updatePreview } from '@core/main/updatePreview.js';

let fileCache = new Map();

let allCssFiles = [];

let allMdFiles = [];

let allHtmlFiles = '';

let htmlCache = new Map(); // Stores <h1>Content</h1>, not # Content

let pagedPolyfillContent = '';

let workFolder = '';

const updateContent = (css, md) => {
    // return updatePreview( (css, md) => {return {css, md} });
}

const PORT = 8080;

// 1. Create a basic HTTP static server
// packages/desktop/server.js
const server = http.createServer((req, res) => {
    // 1. Point 'root' to the folder containing 'packages' (two levels up)

    // 2. Recreate __dirname for ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const projectRoot = path.join(__dirname, '../../');
    
    // 2. Determine the file path
    // If request is '/', serve the desktop index.html
    let relativePath = req.url === '/' ? 'packages/desktop/index.html' : req.url;
    
    // 3. Create the full absolute path
    const filePath = path.join(projectRoot, relativePath);

    // Determine the content type (so the browser knows how to handle it)
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }

    // Read the file and send it to the browser
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 2. Attach the WebSocket Server to the HTTP Server
// Note: We pass { server } instead of { port }
const wss = new WebSocketServer({ 
    server,
    perMessageDeflate: false // Disable compression
 });

wss.on('connection', async function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // Get work folder from process arguments
    workFolder = process.argv[2];

    // We init the cache
    ({fileCache, allCssFiles, allMdFiles} = await initCache(fileCache, allCssFiles, allMdFiles, workFolder));

    console.log("allMdFiles in server after init cache", allMdFiles);

    // We pass the the work directory and the websocket as arguments
    updatePdfPreview(fileCache, allCssFiles, allMdFiles, workFolder, ws);
    // We produce the iframe once and send it
});

// Detect port collision
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\x1b[31m\n  ✘ Error: Port ${PORT} is already in use. Is the app already running?\x1b[0m`);
        process.exit(1);
    }
});

// Listen to the server
server.listen(PORT, () => {

    displayWelcomeBanner();

    displayWelcomeMessage(PORT);

});



///// WATCH DIRECTORY CHANGE

workFolder = process.argv[2];

let debounceTimer;

fs.watch(workFolder, (eventType, filename) => {

    // Safety check: ensure filename exists and isn't a hidden system file
    if (!filename || filename.startsWith('.')) return;

    // Filter: Only care about Markdown or CSS files
    if (!filename.endsWith('.md') && !filename.endsWith('.css')) return;


    // We need to load the updated file into the cache
    // (We load all files on launch)


    // If a timer is running (ID exists), kill it.
    if (debounceTimer) {
        clearTimeout(debounceTimer); 
    }

    debounceTimer = setTimeout( async () => {
        console.log(`Detected change in ${filename} (${eventType})`);
    
        try {
            const rawFileContent = await fs.promises.readFile(path.join(workFolder, filename), 'utf-8');

            console.log('rawFileContent', rawFileContent)

            // Caching srategy
            // For CSS we cache the raw file
            // For md we store the html version
            const updatedFileContent = filename.endsWith('.md') ? await renderMarkdown(rawFileContent) : rawFileContent;

            console.log("server watch updatedFileContent", updatedFileContent)
            // We update the cache
            fileCache.set(filename, updatedFileContent);
            // Safety 1: Handle errors during generation/sending
            wss.clients.forEach((client) => {
                // Safety 2: Check if client is actually open before sending
                if (client.readyState === WebSocket.OPEN) {
                    updatePdfPreview(fileCache, allCssFiles, allMdFiles, workFolder, client);
                }
            });
        } catch (error) {
            console.error("🔥 Error updating preview:", error);
        }

    }, 50); // 100ms buffer

})


