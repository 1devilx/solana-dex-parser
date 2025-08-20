"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumLaunchpadEventParser = void 0;
const borsh_1 = require("borsh");
const buffer_1 = require("buffer");
const constants_1 = require("../../constants");
const instruction_classifier_1 = require("../../instruction-classifier");
const utils_1 = require("../../utils");
const raydium_lcp_create_layout_1 = require("./layouts/raydium-lcp-create.layout");
const raydium_lcp_trade_layout_1 = require("./layouts/raydium-lcp-trade.layout");
class RaydiumLaunchpadEventParser {
    constructor(adapter) {
        this.adapter = adapter;
        this.EventsParsers = {
            CREATE: {
                discriminators: [constants_1.DISCRIMINATORS.RAYDIUM_LCP.CREATE_EVENT],
                slice: 16,
                decode: this.decodeCreateEvent.bind(this),
            },
            TRADE: {
                discriminators: [
                    constants_1.DISCRIMINATORS.RAYDIUM_LCP.BUY_EXACT_IN,
                    constants_1.DISCRIMINATORS.RAYDIUM_LCP.BUY_EXACT_OUT,
                    constants_1.DISCRIMINATORS.RAYDIUM_LCP.SELL_EXACT_IN,
                    constants_1.DISCRIMINATORS.RAYDIUM_LCP.SELL_EXACT_OUT,
                ],
                slice: 8,
                decode: this.decodeTradeInstruction.bind(this),
            },
            COMPLETE: {
                discriminators: [constants_1.DISCRIMINATORS.RAYDIUM_LCP.MIGRATE_TO_AMM, constants_1.DISCRIMINATORS.RAYDIUM_LCP.MIGRATE_TO_CPSWAP],
                slice: 8,
                decode: this.decodeCompleteInstruction.bind(this),
            },
        };
    }
    processEvents() {
        const instructions = new instruction_classifier_1.InstructionClassifier(this.adapter).getInstructions(constants_1.DEX_PROGRAMS.RAYDIUM_LCP.id);
        return this.parseInstructions(instructions);
    }
    parseInstructions(instructions) {
        return (0, utils_1.sortByIdx)(instructions
            .map(({ instruction, outerIndex, innerIndex }) => {
            try {
                const data = (0, utils_1.getInstructionData)(instruction);
                for (const [type, parser] of Object.entries(this.EventsParsers)) {
                    const discriminator = buffer_1.Buffer.from(data.slice(0, parser.slice));
                    if (parser.discriminators.some((it) => discriminator.equals(it))) {
                        const options = {
                            instruction,
                            outerIndex,
                            innerIndex,
                        };
                        const eventData = parser.decode(data, options);
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
                console.error('Failed to parse RaydiumLCP event:', error);
                throw error;
            }
            return null;
        })
            .filter((event) => event !== null));
    }
    decodeTradeInstruction(data, options) {
        const eventInstruction = this.adapter.getInnerInstruction(options.outerIndex, options.innerIndex == undefined ? 0 : options.innerIndex + 1); // find inner instruction
        if (!eventInstruction) {
            throw new Error('Event instruction not found');
        }
        // get event data from inner instruction
        const eventData = (0, utils_1.getInstructionData)(eventInstruction).slice(16);
        const layout = (0, borsh_1.deserializeUnchecked)(raydium_lcp_trade_layout_1.RaydiumLCPTradeLayout.schema, raydium_lcp_trade_layout_1.RaydiumLCPTradeLayout, buffer_1.Buffer.from(eventData));
        const event = layout.toObject();
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(options.instruction);
        event.user = accounts[0];
        event.baseMint = accounts[9];
        event.quoteMint = accounts[10];
        return event;
    }
    decodeCreateEvent(data, options) {
        const eventInstruction = this.adapter.instructions[options.outerIndex]; // find outer instruction
        if (!eventInstruction) {
            throw new Error('Event instruction not found');
        }
        // parse event data
        const eventData = data.slice(16);
        const event = raydium_lcp_create_layout_1.PoolCreateEventLayout.deserialize(eventData).toObject();
        // get instruction accounts
        const accounts = this.adapter.getInstructionAccounts(eventInstruction);
        event.baseMint = accounts[6];
        event.quoteMint = accounts[7];
        return event;
    }
    decodeCompleteInstruction(data, options) {
        const discriminator = buffer_1.Buffer.from(data.slice(0, 8));
        const accounts = this.adapter.getInstructionAccounts(options.instruction);
        const [baseMint, quoteMint, poolMint, lpMint] = discriminator.equals(constants_1.DISCRIMINATORS.RAYDIUM_LCP.MIGRATE_TO_AMM)
            ? [accounts[1], accounts[2], accounts[13], accounts[16]]
            : [accounts[1], accounts[2], accounts[5], accounts[7]];
        const amm = discriminator.equals(constants_1.DISCRIMINATORS.RAYDIUM_LCP.MIGRATE_TO_AMM)
            ? constants_1.DEX_PROGRAMS.RAYDIUM_V4.name
            : constants_1.DEX_PROGRAMS.RAYDIUM_CPMM.name;
        return {
            baseMint,
            quoteMint,
            poolMint,
            lpMint,
            amm,
        };
    }
}
exports.RaydiumLaunchpadEventParser = RaydiumLaunchpadEventParser;
//# sourceMappingURL=parser-raydium-launchpad-event.js.map