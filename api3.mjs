import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parserBin } from './helper.mjs';
import { Server } from 'socket.io';

const baudRate = 19200;
let activePort = null;

// Create a WebSocket server on port 10000
const io = new Server(10000, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow GET and POST methods
    },
});
console.log('WebSocket server running on port 10000');

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

async function findAndConnectPort() {
    try {
        const ports = await SerialPort.list();
        for (const portInfo of ports) {
            const port = new SerialPort({
                path: portInfo.path,
                baudRate,
                autoOpen: false,
            });

            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding: "binary" }));

            port.on('open', () => {
                console.log(`Serial port opened at ${portInfo.path} with ${baudRate} baud`);
            });

            parser.on('data', (data) => {
                if (data.includes('$BIN')) {
                    // console.log(`$BIN detected on port ${portInfo.path}`);
                    activePort = port; // Set the active port
                    try {
                        const parsed = parserBin(data); // Process the data
                        io.emit('data', { ...parsed, hAcc: parsed.hAcc * 1000, vAcc: parsed.vAcc * 1000 });

                    } catch (error) {
                        console.error("Error parsing data")
                    }
                }
            });

            port.on('error', (err) => {
                console.error(`Error on port ${portInfo.path}:`, err.message);
                if (port === activePort) {
                    activePort = null; // Reset active port on error
                }
            });

            port.on('close', () => {
                console.log(`Port ${portInfo.path} closed`);
                if (port === activePort) {
                    activePort = null; // Reset active port on close
                }
            });

            // Attempt to open the port
            port.open((err) => {
                if (err) {
                    console.error(`Failed to open port ${portInfo.path}:`, err.message);
                }
            });
        }
    } catch (err) {
        console.error('Error listing ports:', err.message);
    }
}

// Periodically scan for ports and reconnect if necessary
setInterval(() => {
    if (!activePort) {
        console.log('Scanning for ports...');
        findAndConnectPort();
    }
}, 5000); // Adjust the interval as needed