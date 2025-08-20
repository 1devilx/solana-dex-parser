"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpfunEventParser = void 0;
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
const constants_1 = require("../../constants");
const instruction_classifier_1 = require("../../instruction-classifier");
const utils_1 = require("../../utils");
const binary_reader_1 = require("../binary-reader");
class PumpfunEventParser {
    constructor(adapter) {
        this.adapter = adapter;
        this.eventParsers = {
            TRADE: {
                discriminator: constants_1.DISCRIMINATORS.PUMPFUN.TRADE_EVENT,
                decode: this.decodeTradeEvent.bind(this),
            },
            CREATE: {
                discriminator: constants_1.DISCRIMINATORS.PUMPFUN.CREATE_EVENT,
                decode: this.decodeCreateEvent.bind(this),
            },
            COMPLETE: {
                discriminator: constants_1.DISCRIMINATORS.PUMPFUN.COMPLETE_EVENT,
                decode: this.decodeCompleteEvent.bind(this),
            },
        };
    }
    processEvents() {
        const instructions = new instruction_classifier_1.InstructionClassifier(this.adapter).getInstructions(constants_1.DEX_PROGRAMS.PUMP_FUN.id);
        return this.parseInstructions(instructions);
    }
    parseInstructions(instructions) {
        return (0, utils_1.sortByIdx)(instructions
            .map(({ instruction, outerIndex, innerIndex }) => {
            try {
                const data = (0, utils_1.getInstructionData)(instruction);
                const discriminator = buffer_1.Buffer.from(data.slice(0, 16));
                for (const [type, parser] of Object.entries(this.eventParsers)) {
                    if (discriminator.equals(parser.discriminator)) {
                        const eventData = parser.decode(data.slice(16));
                        if (!eventData)
                            return null;
                        return {
                            type: type,
                            data: eventData,
                            slot: this.adapter.slot,
                            timestamp: this.adapter.blockTime || 0,
                            signature: this.adapter.signature,
                            idx: `${outerIndex}-${innerIndex ?? 0}`,
                        };
                    }
                }
            }
            catch (error) {
                console.error('Failed to parse Pumpfun event:', error);
                throw error;
            }
            return null;
        })
            .filter((event) => event !== null));
    }
    decodeTradeEvent(data) {
        const reader = new binary_reader_1.BinaryReader(data);
        return {
            mint: bs58_1.default.encode(buffer_1.Buffer.from(reader.readFixedArray(32))),
            solAmount: reader.readU64(),
            tokenAmount: reader.readU64(),
            isBuy: reader.readU8() === 1,
            user: bs58_1.default.encode(reader.readFixedArray(32)),
            timestamp: reader.readI64(),
            virtualSolReserves: reader.readU64(),
            virtualTokenReserves: reader.readU64(),
        };
    }
    decodeCreateEvent(data) {
        const reader = new binary_reader_1.BinaryReader(data);
        return {
            name: reader.readString(),
            symbol: reader.readString(),
            uri: reader.readString(),
            mint: bs58_1.default.encode(buffer_1.Buffer.from(reader.readFixedArray(32))),
            bondingCurve: bs58_1.default.encode(reader.readFixedArray(32)),
            user: bs58_1.default.encode(reader.readFixedArray(32)),
        };
    }
    decodeCompleteEvent(data) {
        const reader = new binary_reader_1.BinaryReader(data);
        return {
            user: bs58_1.default.encode(reader.readFixedArray(32)),
            mint: bs58_1.default.encode(buffer_1.Buffer.from(reader.readFixedArray(32))),
            bondingCurve: bs58_1.default.encode(reader.readFixedArray(32)),
            timestamp: reader.readI64(),
        };
    }
}
exports.PumpfunEventParser = PumpfunEventParser;
//# sourceMappingURL=parser-pumpfun-event.js.map