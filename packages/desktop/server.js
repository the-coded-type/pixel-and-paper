import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 1. Import this
import { WebSocketServer } from 'ws';
import { displayWelcomeBanner, displayWelcomeMessage } from './ui/termnial.js';
import { readTextFile } from './readTextFile.js';
// import { updatePreview } from '@core/main/updatePreview.js';

const updateContent = (css, md) => {
    // return updatePreview( (css, md) => {return {css, md} });
}

function loadFiles () {

    const workFolder = process.argv[2];

    console.log(`📂 Loading files from: ${path.resolve(workFolder)}`);

    // Check if files folder exists
    if (!fs.existsSync(workFolder)) {
        console.error(`❌ Error: The folder "${workFolder}" does not exist.`);
        return { css: [], md: [] }; // Return empty data
    };

    const allWorkFiles = fs.readdirSync(workFolder).map(fileName => {
        return path.join(workFolder, fileName);
    });

    const allCssFiles = allWorkFiles.filter(f => f.endsWith('.css')).sort((a, b) => a.localeCompare(b));

    const allMdFiles = allWorkFiles.filter(f => f.endsWith('.md')).sort((a, b) => a.localeCompare(b));
    
    const allCssContent = allCssFiles.map( f => readTextFile(f) );

    const allMdContent = allMdFiles.map( f => readTextFile(f) );

    return {allCssContent, allMdContent};

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

wss.on('connection', function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Hello from the combined Node.js server!');

    const {allCssContent, allMdContent} = loadFiles();

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

}
);

