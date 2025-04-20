
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
                pos: 48,
                type: "FloatLE",
                round: 2
            },
            pitch: {
                pos: 52,
                type: "FloatLE",
                round: 2
            },
            roll: {
                pos: 56,
                type: "FloatLE",
                round: 2
            },
            
            Vacc: {
                pos: 74,
                type: "FloatLE",
                round: 2
            },
            Hacc: {
                pos: 78,
                type: "FloatLE",
                round: 2
            },



        }
    }
}

export const navModes = {
    0: "No fix",
1: "Fix 2d no diff",
2: "Fix 3d no diff",
3: "Fix 2D with diff",
4: "Fix 3D with diff",
5: "RTK float",
6: "RTK integer fixed",
7: "RTK float (SureFix enabled)",
8: "RTK integer fixed (SureFix enabled)",
9: "RTK SureFixed",
10: "aRTK integer fixed",
11: "aRTK float",
12: "aRTK Atlas converged",
13: "aRTK Atlas un-converged",
14: "Atlas converged",
15: "Atlas un-converged",
}

export const decodeField = (buffer, container, field) => {
    const params = binMsg[container].fields[field]
    const offset = binMsg[container].offset + params.pos
    return decodeType(buffer, params.type, offset, params.round)
}