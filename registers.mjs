
const roundTo = (num, decimals) => Number(num.toFixed(decimals));

const decodeType = (buffer, type, offset, round) => {
    switch (type) {
        case "Int8":
            return buffer.readUInt8(offset)
        case "Int16LE":
            return buffer.readUInt16LE(offset)
        case "DoubleLE":
            return roundTo(buffer.readDoubleLE(offset), round)
        case "FloatLE":
            return roundTo(buffer.readFloatLE(offset), round)
        default:
            return false;
    }
}

export const binMsg = {
    bin1: {
        block: 1,
        offset: 8,
        fields: {
            ageOfDiff: {
                pos: 0,
                type: "Int8",
            },
            numSats: {
                pos: 1,
                type: "Int8",

            },
            gpsWeek: {
                pos: 2,
                type: "Int16LE",
            },
            gpsTofWeek: {
                pos: 4,
                type: "DoubleLE",
                round: 0
            },
            latitude: {
                pos: 12,
                type: "DoubleLE",
                round: 8
            },
            longitude: {
                pos: 20,
                type: "DoubleLE",
                round: 8
            },
            height: {
                pos: 28,
                type: "FloatLE",
                round: 2
            },


        }
    },
    bin3: {
        block: 3,
        offset: 8,
        fields: {

            gpsTofWeek: {
                pos: 0,
                type: "DoubleLE",
                round: 0
            },
            gpsWeek: {
                pos: 8,
                type: "Int16LE",
                round: 0
            },
            satsTracked: {
                pos: 10,
                type: "Int16LE",
                round: 0
            },
            numSats: {
                pos: 12,
                type: "Int16LE",
                round: 0
            },
            navMode: {
                pos: 14,
                type: "Int8",
                round: 0
            },


            latitude: {
                pos: 16,
                type: "DoubleLE",
                round: 8
            },
            longitude: {
                pos: 24,
                type: "DoubleLE",
                round: 8
            },
            height: {
                pos: 32,
                type: "FloatLE",
                round: 2
            },
            hSpeed: {
                pos: 36,
                type: "FloatLE",
                round: 2
            },
            heading: {
                pos: 40,
                type: "FloatLE",
                round: 2
            },
            pitch: {
                pos: 44,
                type: "FloatLE",
                round: 2
            },
            roll: {
                pos: 48,
                type: "FloatLE",
                round: 2
            },



        }
    }
}


export const decodeField = (buffer, container, field) => {
    const params = binMsg[container].fields[field]
    const offset = binMsg[container].offset + params.pos
    return decodeType(buffer, params.type, offset, params.round)
}