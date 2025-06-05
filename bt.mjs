import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parserBin } from './helper.mjs';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import fs from 'fs';
import { exec } from 'child_process';




// Load settings from settings.json
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const { ntrip, btmac } = settings;

const baudRate = 19200;
let activePort = null;
let lastActive = null;

exec(`sudo rfcomm bind /dev/rfcomm0 ${btmac} 1`, (error, stdout, stderr) => {
    console.log("... bt binding:", btmac)
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

// Create a WebSocket server on port 10000
const io = new Server(10000, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow GET and POST methods
    },
});
console.log('... WebSocket running on port 10000');

io.on('connection', (socket) => {
    console.log('... web client connected');
    socket.on('disconnect', () => {
        console.log('... web client disconnected');
    });
});

const targets = ["USB", "rfcomm"]

const isTarget = (path) => {
    return targets.some(target => path.includes(target));
};

async function findAndConnectPort() {
    try {
        let ports = await SerialPort.list();
        ports = ports.filter(p => isTarget(p.path))
        for (const portInfo of ports) {
            const port = new SerialPort({
                path: portInfo.path,
                baudRate,
                autoOpen: false,
            });

            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding: "binary" }));

            port.on('open', () => {
                console.log(`... opening ${portInfo.path} at ${baudRate}`);
            });

            parser.on('data', (data) => {
                if (data.includes('$BIN')) {
                    // console.log(`$BIN detected on port ${portInfo.path}`);
                    activePort = port; // Set the active port
                    if (activePort !== lastActive) {
                        console.log("... activePort:", activePort.path)
                    }
                    lastActive = activePort
                    try {
                        const parsed = parserBin(data); // Process the data
                        io.emit('data', { ...parsed, hAcc: parsed.hAcc * 1000, vAcc: parsed.vAcc * 1000 });

                    } catch (error) {
                        console.error("... error parsing hgnss data")
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
                    console.error(`... ${portInfo.path}:`, err.message);
                }
            });
        }
    } catch (err) {
        console.error('... error listing ports:', err.message);
    }
}

// Periodically scan for ports and reconnect if necessary
setInterval(() => {
    if (!activePort) {
        console.log('... scanning ports');
        findAndConnectPort();
    }
}, 5000); // Adjust the interval as needed

// Connect to the WebSocket server as a client
const socket = Client(ntrip);
let ntrip_count = 0;

socket.on('connect', () => {
    console.log(`... web ntrip at ${ntrip}`);

});

socket.on("rtcm", (data) => {
    if (data) {
        if (activePort) {
            activePort.write(data);
            if (ntrip_count === 0) console.log("... web ntrip sent:", data.length);
            ntrip_count++;
            if (ntrip_count > 15) ntrip_count = 0;
        }
    }
});