"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaydiumTradeInfo = void 0;
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const getRaydiumTradeInfo = (event, inputToken, outputToken, info) => {
    const { mint: inputMint, decimals: inputDecimal } = inputToken;
    const { mint: outputMint, decimals: ouptDecimal } = outputToken;
    const isBuy = event.tradeDirection === types_1.TradeDirection.Buy;
    const fee = BigInt(event.protocolFee) + BigInt(event.creatorFee) + BigInt(event.platformFee);
    return {
        type: isBuy ? 'BUY' : 'SELL',
        Pool: [event.poolState],
        inputToken: {
            mint: inputMint,
            amount: (0, types_1.convertToUiAmount)(event.amountIn, inputDecimal),
            amountRaw: event.amountIn.toString(),
            decimals: inputDecimal,
        },
        outputToken: {
            mint: outputMint,
            amount: (0, types_1.convertToUiAmount)(event.amountOut, ouptDecimal),
            amountRaw: event.amountOut.toString(),
            decimals: ouptDecimal,
        },
        fee: {
            mint: isBuy ? inputMint : outputMint,
            amount: (0, types_1.convertToUiAmount)(fee, isBuy ? inputDecimal : ouptDecimal),
            amountRaw: fee.toString(),
            decimals: isBuy ? inputDecimal : ouptDecimal,
        },
        user: event.user,
        programId: info.dexInfo?.programId || constants_1.DEX_PROGRAMS.RAYDIUM_LCP.id,
        amm: constants_1.DEX_PROGRAMS.RAYDIUM_LCP.name,
        route: info.dexInfo?.route || '',
        slot: info.slot,
        timestamp: info.timestamp,
        signature: info.signature,
        idx: info.idx || '',
    };
};
exports.getRaydiumTradeInfo = getRaydiumTradeInfo;
//# sourceMappingURL=util.js.map