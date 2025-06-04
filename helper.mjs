import { binMsg, decodeField } from "./registers.mjs";

export const parserBin = (hex) => {
    // Convert hex string to buffer
    const buffer = Buffer.from(hex, 'binary');
    const sync = buffer.slice(0, 4).toString();
    const block = buffer.readInt16LE(4)
    if (sync == '$BIN') {
        if (block == 1) {
            return parseBin1(buffer)
        }
        if (block == 3) {
            // console.log("... bin3")
            return parseBin3(buffer)
        }
        else {
            console.log("... unknown stream")
        }

    } else {
        console.log("... stream error")
    }
};

export const parseBin1 = (buffer) => {

    const fields = binMsg.bin1.fields
    const payload = {}
    Object.keys(fields).forEach(f => {
        // console.log(f, decodeField(buffer, "bin1", f))
        payload[f] = decodeField(buffer, "bin1", f)
    });
    return payload
};

export const parseBin3 = (buffer) => {
    const fields = binMsg.bin3.fields
    const payload = {}
    Object.keys(fields).forEach(f => {
        // console.log(f, decodeField(buffer, "bin3", f))
        payload[f] = decodeField(buffer, "bin3", f)
    });
    return payload
};






