
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parserBin } from './helper.mjs';

const baudRate = 19200;
let activePort = null;

async function findAndConnectPort() {
    try {
        let ports = await SerialPort.list();
        ports = ports.filter(p => p.path.includes("USB"))
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
                    console.log(`$BIN detected on port ${portInfo.path}`);
                    activePort = port; // Set the active port
                    parserBin(data); // Process the data
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