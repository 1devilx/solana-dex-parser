"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaydiumLCPTradeLayout = void 0;
const bs58_1 = __importDefault(require("bs58"));
const raydium_1 = require("../../../types/raydium");
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
    toObject() {
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
            tradeDirection: this.tradeDirection === 0 ? raydium_1.TradeDirection.Buy : raydium_1.TradeDirection.Sell,
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
                ['tradeDirection', 'u8'],
                ['poolStatus', 'u8'],
            ],
        },
    ],
]);
//# sourceMappingURL=raydium-lcp-trade.layout.js.map