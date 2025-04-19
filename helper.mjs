import { binMsg, decodeField } from "./registers.mjs";

export const parserBin = (hex) => {
    // Convert hex string to buffer
    const buffer = Buffer.from(hex, 'binary');
    const sync = buffer.slice(0, 4).toString();
    const block = buffer.readInt16LE(4)
    if (sync == '$BIN') {
        if (block == 1) {
            parseBin1(buffer)
        }
        if (block == 3) {
            console.log("... bin3")
            parseBin3(buffer)


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
    Object.keys(fields).forEach(f => {
        console.log(f, decodeField(buffer, "bin1", f))
    });

};

export const parseBin3 = (buffer) => {

    const fields = binMsg.bin3.fields
    Object.keys(fields).forEach(f => {
        console.log(f, decodeField(buffer, "bin3", f))
    });

};






