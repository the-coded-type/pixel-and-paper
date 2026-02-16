/**
 * @module server
 * @description Main entry point for the Desktop Application.
 * This server handles three key responsibilities:
 * 1. Serving static files (HTML, CSS, JS) via HTTP.
 * 2. Managing a WebSocket connection for live-reloading the preview.
 * 3. Watching the file system for changes and updating the cache/client.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { displayWelcomeBanner, displayWelcomeMessage } from './ui/termnial.js';
import { updateIframeHtmlContent } from './updateIframeHtmlContent.js';
import { initCache } from './initCache.js';
import { renderMarkdown } from '../core/src/markdown/iframeHtml.js';

let fileCache = new Map();

let allCssFiles = [];

let allMdFiles = [];

let allHtmlFiles = '';

let allJsFiles = [];

let htmlCache = new Map(); 

let pagedPolyfillContent = '';

let workFolder = '';

const PORT = 8080;

// Get work folder from process arguments
workFolder = process.argv[2];

// Check if wor folder exists and is accessible
try {
    // 3. Use statSync (throws error if not found)
    const stats = fs.statSync(workFolder);

    // 4. Verify it is actually a Directory
    if (!stats.isDirectory()) {
        console.error(`❌ Error: "${workFolder}" exists but is a FILE, not a folder.`);
        process.exit(1);
    }
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error(`❌ Error: The folder "${workFolder}" does not exist.`);
    } else {
        console.error(`❌ Error: Could not access folder. (${err.code})`);
    }
    process.exit(1);
}

// --- HTTP Server Configuration ---
/**
* Creates the HTTP server to serve static assets.
* Acts as a local CDN for the application.
*/
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
    let filePath = path.join(projectRoot, relativePath);


    // Determine Request Type (App Asset vs. User Image)
    const extNameCheck = path.extname(req.url).toLowerCase();
    // List of supported image types
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const isImageRequest = imageExtensions.includes(extNameCheck);

    if (isImageRequest) {
        // User Image -> Serve from workFolder
        // Remove leading slash to join correctly (e.g. "/img.png" -> "img.png")
        const safeUrl = req.url.startsWith('/') ? req.url.slice(1) : req.url;
        filePath = path.join(workFolder, safeUrl);
    };

    let contentType = 'text/html';

    // Determine the content type (so the browser knows how to handle it)
    const extname = path.extname(filePath);
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
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.jpeg': contentType = 'image/jpeg'; break;
        case '.gif': contentType = 'image/gif'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
        case '.webp': contentType = 'image/webp'; break;
    }

    // Read the file and send it to the browser
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                console.warn(`File not found: ${filePath}`);
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

// --- WebSocket Server Configuration ---
// Attach WebSocket functionality to the existing HTTP server instance
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

    // We init the cache
    ({ fileCache, allCssFiles, allMdFiles, allJsFiles } = await initCache(fileCache, allCssFiles, allMdFiles, allJsFiles, workFolder));

    // We pass the the work directory and the websocket as arguments
    updateIframeHtmlContent(fileCache, allCssFiles, allMdFiles, allJsFiles, workFolder, ws);
    // We produce the iframe once and send it
});

// --- Error Handling & Startup ---

// Handle port collisions (e.g., if the app is already running)
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\x1b[31m\n  ✘ Error: Port ${PORT} is already in use. Is the app already running?\x1b[0m`);
        process.exit(1);
    }
});

// Start the server, displays welcome messages in the terminal
server.listen(PORT, () => {
    displayWelcomeBanner();
    displayWelcomeMessage(PORT);
});



// --- File Watcher Logic ---


let debounceTimer;

/**
 * Watches the work directory for changes.
 * Uses a debounce timer to prevent spamming updates during successive rapid saves.
 */
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

    debounceTimer = setTimeout(async () => {
        console.time("Server Change Processing"); // START TIMER
        console.log(`Detected change in ${filename} (${eventType})`);

        try {
            const rawFileContent = await fs.promises.readFile(path.join(workFolder, filename), 'utf-8');

            console.log('rawFileContent', rawFileContent)

            // Caching srategy
            // For CSS we cache the raw file
            // For md we store the html version
            const updatedFileContent = filename.endsWith('.md') ? await renderMarkdown(rawFileContent) : rawFileContent;
            console.timeEnd("Server Change Processing"); // STOP TIMER
            // We update the cache
            fileCache.set(filename, updatedFileContent);
            // Safety 1: Handle errors during generation/sending
            wss.clients.forEach((client) => {
                // Safety 2: Check if client is actually open before sending
                if (client.readyState === WebSocket.OPEN) {
                    updateIframeHtmlContent(fileCache, allCssFiles, allMdFiles, allJsFiles, workFolder, client);
                }
            });
        } catch (error) {
            console.error("🔥 Error updating preview:", error);
        }

    }, 50); // 100ms buffer

})


