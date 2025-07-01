import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { parserBin } from './helper.mjs';

const baudRate = 19200
const port = new SerialPort({
    path: '/dev/ttyUSB4',
    baudRate,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n', encoding: "binary" }));

port.on('open', () => {
    console.log('Serial port opened at', baudRate, 'baud');
});

parser.on('data', (data) => {
    parserBin(data)
});

port.on('error', (err) => {
    console.error('Error:', err.message);
});
