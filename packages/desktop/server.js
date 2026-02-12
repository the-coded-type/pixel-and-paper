import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 1. Import this
import { WebSocketServer } from 'ws';
import { displayWelcomeBanner, displayWelcomeMessage } from './ui/termnial.js';
import { updatePdfPreview } from './updatePdfPreview.js';

// import { updatePreview } from '@core/main/updatePreview.js';

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
const wss = new WebSocketServer({ server });

wss.on('connection', async function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // Get work folder from process arguments
    const workFolder = process.argv[2];

    // We pass the the work directory and the websocket as arguments
    updatePdfPreview(workFolder, ws);
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

const workFolder = process.argv[2];

let debounceTimer;

fs.watch(workFolder, (eventType, filename) => {

    // Safety check: ensure filename exists and isn't a hidden system file
    if (!filename || filename.startsWith('.')) return;

    // Filter: Only care about Markdown or CSS files
    if (!filename.endsWith('.md') && !filename.endsWith('.css')) return;


    // If a timer is running (ID exists), kill it.
    if (debounceTimer) {
        clearTimeout(debounceTimer); 
    }

    debounceTimer = setTimeout( async () => {
        console.log(`Detected change in ${filename} (${eventType})`);
    
        try {
            // Safety 1: Handle errors during generation/sending
            wss.clients.forEach((client) => {
                // Safety 2: Check if client is actually open before sending
                if (client.readyState === WebSocket.OPEN) {
                    updatePdfPreview(workFolder, client);
                }
            });
        } catch (error) {
            console.error("🔥 Error updating preview:", error);
        }

    }, 100); // 400ms buffer

})


