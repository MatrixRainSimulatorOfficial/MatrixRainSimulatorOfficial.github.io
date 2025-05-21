const WebSocket = require('ws');

// This file sets up a basic WebSocket server using the "ws" library.
// Make sure to install the "ws" package via npm: npm install ws


const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

const clients = new Set();

server.on('connection', (ws) => {
    console.log('A new client connected.');
    clients.add(ws);

    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        // Broadcast received messages to all connected clients
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
    const req = arguments[1];
    if (!req || !req.headers.origin || (req.headers.origin !== 'https://matrixrainsimulatorofficial.github.io' && !req.headers.origin.match(/^https?:\/\//) && !req.url.endsWith('.html'))) {
        console.log('Connection rejected: Only HTML clients are allowed.');
        ws.close();
        return;
    }
    ws.on('close', () => {
        console.log('Client disconnected.');
        clients.delete(ws);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

console.log(`WebSocket server is listening on ws://localhost:${PORT}`);