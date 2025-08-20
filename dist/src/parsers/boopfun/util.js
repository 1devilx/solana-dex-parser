"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoopfunTradeInfo = void 0;
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const getBoopfunTradeInfo = (event, info) => {
    const tradeType = event.isBuy ? 'BUY' : 'SELL';
    const isBuy = tradeType === 'BUY';
    return {
        type: tradeType,
        inputToken: {
            mint: isBuy ? constants_1.TOKENS.SOL : event.mint,
            amount: isBuy ? (0, types_1.convertToUiAmount)(event.solAmount) : (0, types_1.convertToUiAmount)(event.tokenAmount, 6),
            amountRaw: isBuy ? event.solAmount.toString() : event.tokenAmount.toString(),
            decimals: isBuy ? 9 : 6,
        },
        outputToken: {
            mint: isBuy ? event.mint : constants_1.TOKENS.SOL,
            amount: isBuy ? (0, types_1.convertToUiAmount)(event.tokenAmount, 6) : (0, types_1.convertToUiAmount)(event.solAmount),
            amountRaw: isBuy ? event.tokenAmount.toString() : event.solAmount.toString(),
            decimals: isBuy ? 6 : 9,
        },
        user: event.user,
        programId: constants_1.DEX_PROGRAMS.BOOP_FUN.id,
        amm: info.dexInfo?.amm || constants_1.DEX_PROGRAMS.BOOP_FUN.name,
        route: info.dexInfo?.route || '',
        slot: info.slot,
        timestamp: info.timestamp,
        signature: info.signature,
        idx: info.idx || '',
    };
};
exports.getBoopfunTradeInfo = getBoopfunTradeInfo;
//# sourceMappingURL=util.js.map