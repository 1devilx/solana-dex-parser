"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoopfunEventParser = void 0;
const constants_1 = require("../../constants");
const instruction_classifier_1 = require("../../instruction-classifier");
const utils_1 = require("../../utils");
const binary_reader_1 = require("../binary-reader");
/**
 * Parse Boopfun events (CREATE/BUY/SELL/COMPLETE)
 */
class BoopfunEventParser {
    constructor(adapter, transferActions) {
        this.adapter = adapter;
        this.transferActions = transferActions;
        this.eventParsers = {
            BUY: {
                discriminators: [constants_1.DISCRIMINATORS.BOOPFUN.BUY],
                slice: 8,
                decode: this.decodeBuyEvent.bind(this),
            },
            SELL: {
                discriminators: [constants_1.DISCRIMINATORS.BOOPFUN.SELL],
                slice: 8,
                decode: this.decodeSellEvent.bind(this),
            },
            CREATE: {
                discriminators: [constants_1.DISCRIMINATORS.BOOPFUN.CREATE],
                slice: 8,
                decode: this.decodeCreateEvent.bind(this),
            },
            COMPLETE: {
                discriminators: [constants_1.DISCRIMINATORS.BOOPFUN.COMPLETE],
                slice: 8,
                decode: this.decodeCompleteEvent.bind(this),
            },
        };
    }
    processEvents() {
        const instructions = new instruction_classifier_1.InstructionClassifier(this.adapter).getInstructions(constants_1.DEX_PROGRAMS.BOOP_FUN.id);
        return this.parseInstructions(instructions);
    }
    parseInstructions(instructions) {
        return (0, utils_1.sortByIdx)(instructions
            .map(({ instruction, outerIndex, innerIndex }) => {
            try {
                const data = (0, utils_1.getInstructionData)(instruction);
                for (const [type, parser] of Object.entries(this.eventParsers)) {
                    const discriminator = Buffer.from(data.slice(0, parser.slice));
                    if (parser.discriminators.some((it) => discriminator.equals(it))) {
                        const options = {
                            instruction,
                            outerIndex,
                            innerIndex,
                        };
                        const eventData = parser.decode(data.slice(parser.slice), options);
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
                console.error('Failed to parse Boopfun event:', error);
                throw error;
            }
            return null;
        })
            .filter((event) => event !== null));
    }
    decodeBuyEvent(data, options) {
        const { instruction, outerIndex, innerIndex } = options;
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(instruction);
        const reader = new binary_reader_1.BinaryReader(data);
        const transfers = this.getTransfersForInstruction(this.adapter.getInstructionProgramId(instruction), outerIndex, innerIndex);
        const transfer = transfers.find((transfer) => transfer.info.mint == accounts[0]);
        return {
            mint: accounts[0],
            solAmount: reader.readU64(),
            tokenAmount: BigInt(transfer?.info.tokenAmount.amount || '0'),
            isBuy: true,
            user: accounts[6],
            bondingCurve: accounts[1],
        };
    }
    decodeSellEvent(data, options) {
        const { instruction, outerIndex, innerIndex } = options;
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(instruction);
        const reader = new binary_reader_1.BinaryReader(data);
        const transfers = this.getTransfersForInstruction(this.adapter.getInstructionProgramId(instruction), outerIndex, innerIndex);
        const transfer = transfers.find((transfer) => transfer.info.mint == constants_1.TOKENS.SOL);
        return {
            mint: accounts[0],
            solAmount: BigInt(transfer?.info.tokenAmount.amount || '0'),
            tokenAmount: reader.readU64(),
            isBuy: false,
            user: accounts[6],
            bondingCurve: accounts[1],
        };
    }
    decodeCreateEvent(data, options) {
        const { instruction } = options;
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(instruction);
        const reader = new binary_reader_1.BinaryReader(data);
        reader.readU64();
        return {
            name: reader.readString(),
            symbol: reader.readString(),
            uri: reader.readString(),
            mint: accounts[2],
            user: accounts[3],
        };
    }
    decodeCompleteEvent(data, options) {
        const { instruction, outerIndex, innerIndex } = options;
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(instruction);
        const transfers = this.getTransfersForInstruction(this.adapter.getInstructionProgramId(instruction), outerIndex, innerIndex);
        const sols = transfers
            .filter((transfer) => transfer.info.mint == constants_1.TOKENS.SOL)
            .sort((a, b) => b.info.tokenAmount.uiAmount - a.info.tokenAmount.uiAmount);
        return {
            user: accounts[10],
            mint: accounts[0],
            bondingCurve: accounts[7],
            solAmount: BigInt(sols[0].info.tokenAmount.amount),
            feeAmount: sols.length > 1 ? BigInt(sols[1].info.tokenAmount.amount) : BigInt(0),
        };
    }
    getTransfersForInstruction(programId, outerIndex, innerIndex) {
        const key = `${programId}:${outerIndex}${innerIndex == undefined ? '' : `-${innerIndex}`}`;
        const transfers = this.transferActions[key] || [];
        return transfers.filter((t) => ['transfer', 'transferChecked'].includes(t.type));
    }
}
exports.BoopfunEventParser = BoopfunEventParser;
//# sourceMappingURL=parser-boopfun-event.js.map