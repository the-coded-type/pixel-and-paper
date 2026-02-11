const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const figlet = require("figlet");

function displayWelcomeBanner() {
    // 1. Generate the ASCII art with the specific font
    console.clear();
    console.log('\n\n')
    const text = figlet.textSync("Pixel & Paper", {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    });

    // 2. Define the Orange Color (256-color mode)
    // \x1b[38;5;208m = Orange
    // \x1b[0m = Reset to default
    const orange = "\x1b[38;5;208m";
    const reset = "\x1b[0m";

    // 3. Print the colored text
    console.log(orange + text + reset);
}

const PORT = 8080;

// 1. Create a basic HTTP static server
const server = http.createServer((req, res) => {

    console.log('Request for:', req.url);

    // Map URL to a local file path
    // If the request is just '/', serve 'index.html'
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

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
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Hello from the combined Node.js server!');
});

// 3. Start listening
const style = {
    green: (text) => `\x1b[32m${text}\x1b[0m`,
    blue: (text) => `\x1b[34m${text}\x1b[0m`,
    yellow: (text) => `\x1b[33m${text}\x1b[0m`,
    bold: (text) => `\x1b[1m${text}\x1b[0m`,
    link: (text, url) => `\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`
};

// ... inside your server.listen callback:
server.listen(PORT, () => {
  displayWelcomeBanner();

    console.log(`
  ${style.green('✔ Server Started Successfully!')}
  
  ${style.bold('Local System:')}    ${style.link(`http://localhost:${PORT}`, `http://localhost:${PORT}`)}
  ${style.bold('WebSocket:')}       ${style.yellow(`ws://localhost:${PORT}`)}
  
  ${style.blue('Press Ctrl+C to stop')}
    `);


});