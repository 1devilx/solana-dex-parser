"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumLCPTradeLayout = exports.TradeDirectionSchema = exports.TradeDirectionClass = exports.Sell = exports.Buy = void 0;
const bs58_1 = __importDefault(require("bs58"));
const borsh_1 = require("borsh");
const raydium_1 = require("../../../types/raydium");
// Borsh-compatible enum variant classes
class Buy {
}
exports.Buy = Buy;
class Sell {
}
exports.Sell = Sell;
// Enum wrapper
class TradeDirectionClass {
}
exports.TradeDirectionClass = TradeDirectionClass;
// Borsh schema for enum
exports.TradeDirectionSchema = new Map([
    [
        TradeDirectionClass,
        {
            kind: 'enum',
            values: [
                ['Buy', Buy],
                ['Sell', Sell],
            ],
        },
    ],
    [Buy, { kind: 'struct', fields: [] }],
    [Sell, { kind: 'struct', fields: [] }],
]);
class RaydiumLCPTradeLayout {
    constructor(fields) {
        this.poolState = fields.poolState;
        this.totalBaseSell = fields.totalBaseSell;
        this.virtualBase = fields.virtualBase;
        this.virtualQuote = fields.virtualQuote;
        this.realBaseBefore = fields.realBaseBefore;
        this.realQuoteBefore = fields.realQuoteBefore;
        this.realBaseAfter = fields.realBaseAfter;
        this.realQuoteAfter = fields.realQuoteAfter;
        this.amountIn = fields.amountIn;
        this.amountOut = fields.amountOut;
        this.protocolFee = fields.protocolFee;
        this.platformFee = fields.platformFee;
        this.shareFee = fields.shareFee;
        this.tradeDirection = fields.tradeDirection;
        this.poolStatus = fields.poolStatus;
    }
    static fromBuffer(buffer) {
        return (0, borsh_1.deserializeUnchecked)(RaydiumLCPTradeLayout.schema, RaydiumLCPTradeLayout, buffer);
    }
    toObject() {
        const tradeDir = this.tradeDirection instanceof Buy ? raydium_1.TradeDirection.Buy : raydium_1.TradeDirection.Sell;
        return {
            poolState: bs58_1.default.encode(this.poolState),
            totalBaseSell: this.totalBaseSell,
            virtualBase: this.virtualBase,
            virtualQuote: this.virtualQuote,
            realBaseBefore: this.realBaseBefore,
            realQuoteBefore: this.realQuoteBefore,
            realBaseAfter: this.realBaseAfter,
            amountIn: this.amountIn,
            amountOut: this.amountOut,
            protocolFee: this.protocolFee,
            platformFee: this.platformFee,
            shareFee: this.shareFee,
            tradeDirection: tradeDir,
            poolStatus: this.poolStatus,
            baseMint: '',
            quoteMint: '',
            user: '',
        };
    }
}
exports.RaydiumLCPTradeLayout = RaydiumLCPTradeLayout;
RaydiumLCPTradeLayout.schema = new Map([
    [
        RaydiumLCPTradeLayout,
        {
            kind: 'struct',
            fields: [
                ['poolState', [32]],
                ['totalBaseSell', 'u64'],
                ['virtualBase', 'u64'],
                ['virtualQuote', 'u64'],
                ['realBaseBefore', 'u64'],
                ['realQuoteBefore', 'u64'],
                ['realBaseAfter', 'u64'],
                ['realQuoteAfter', 'u64'],
                ['amountIn', 'u64'],
                ['amountOut', 'u64'],
                ['protocolFee', 'u64'],
                ['platformFee', 'u64'],
                ['shareFee', 'u64'],
                ['tradeDirection', TradeDirectionClass],
                ['poolStatus', 'u8'],
            ],
        },
    ],
    ...exports.TradeDirectionSchema,
]);
//# sourceMappingURL=raydium-lcp-trade.layout.js.map