"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinalSwap = exports.sortByIdx = exports.getPubkeyString = exports.getTranferTokenMint = exports.getAMMs = exports.getTradeType = exports.absBigInt = exports.hexToUint8Array = exports.getProgramName = exports.decodeInstructionData = exports.getInstructionData = void 0;
const bs58_1 = __importDefault(require("bs58"));
const constants_1 = require("./constants");
const types_1 = require("./types");
const web3_js_1 = require("@solana/web3.js");
/**
 * Get instruction data
 */
const getInstructionData = (instruction) => {
    if ('data' in instruction) {
        return (0, exports.decodeInstructionData)(instruction.data);
    }
    return instruction.data;
};
exports.getInstructionData = getInstructionData;
const decodeInstructionData = (data) => {
    if (typeof data === 'string')
        return Buffer.from(bs58_1.default.decode(data)); // compatible with both bs58 v4.0.1 and v6.0.0
    if (data instanceof Uint8Array)
        return Buffer.from(data);
    if ('type' in data && data.type == 'Buffer')
        return Buffer.from(data.data);
    return data;
};
exports.decodeInstructionData = decodeInstructionData;
/**
 * Get the name of a program by its ID
 * @param programId - The program ID to look up
 * @returns The name of the program or 'Unknown' if not found
 */
const getProgramName = (programId) => Object.values(constants_1.DEX_PROGRAMS).find((dex) => dex.id === programId)?.name || 'Unknown';
exports.getProgramName = getProgramName;
/**
 * Convert a hex string to Uint8Array
 * @param hex - Hex string to convert
 * @returns Uint8Array representation of the hex string
 */
const hexToUint8Array = (hex) => new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
exports.hexToUint8Array = hexToUint8Array;
const absBigInt = (value) => {
    return value < 0n ? -value : value;
};
exports.absBigInt = absBigInt;
const getTradeType = (inMint, outMint) => {
    if (inMint == constants_1.TOKENS.SOL)
        return 'BUY';
    if (outMint == constants_1.TOKENS.SOL)
        return 'SELL';
    if (Object.values(constants_1.TOKENS).includes(inMint))
        return 'BUY';
    return 'SELL';
};
exports.getTradeType = getTradeType;
const getAMMs = (transferActionKeys) => {
    const amms = Object.values(constants_1.DEX_PROGRAMS).filter((it) => it.tags.includes('amm'));
    return transferActionKeys
        .map((it) => {
        const item = Object.values(amms).find((amm) => it.split(':')[0] == amm.id);
        if (item)
            return item.name;
        return null;
    })
        .filter((it) => it != null);
};
exports.getAMMs = getAMMs;
const getTranferTokenMint = (token1, token2) => {
    if (token1 == token2)
        return token1;
    if (token1 && token1 != constants_1.TOKENS.SOL)
        return token1;
    if (token2 && token2 != constants_1.TOKENS.SOL)
        return token2;
    return token1 || token2;
};
exports.getTranferTokenMint = getTranferTokenMint;
const getPubkeyString = (value) => {
    if (typeof value === 'string')
        return value;
    if (value instanceof web3_js_1.PublicKey)
        return value.toBase58();
    if ('type' in value && value.type == 'Buffer')
        return bs58_1.default.encode(value.data);
    if (value instanceof Buffer)
        return bs58_1.default.encode(value);
    return value;
};
exports.getPubkeyString = getPubkeyString;
// ... existing code ...
/**
 * Sort an array of TradeInfo objects by their idx field
 * The idx format is 'main-sub', such as '1-0', '2-1', etc.
 * @param items The TradeInfo array to be sorted
 * @returns The sorted TradeInfo array
 */
const sortByIdx = (items) => {
    return items && items.length > 1
        ? [...items].sort((a, b) => {
            const [aMain, aSub = '0'] = a.idx.split('-');
            const [bMain, bSub = '0'] = b.idx.split('-');
            const mainDiff = parseInt(aMain) - parseInt(bMain);
            if (mainDiff !== 0)
                return mainDiff;
            return parseInt(aSub) - parseInt(bSub);
        })
        : items;
};
exports.sortByIdx = sortByIdx;
const getFinalSwap = (trades, dexInfo) => {
    if (trades.length == 1)
        return trades[0];
    if (trades.length >= 2) {
        // sort by idx
        if (trades.length > 2) {
            trades = (0, exports.sortByIdx)(trades);
        }
        const inputTrade = trades[0];
        const outputTrade = trades[trades.length - 1];
        const pools = [];
        if (trades.length >= 2) {
            // Merge trades
            let [inputAmount, outputAmount] = [0n, 0n];
            for (const trade of trades) {
                if (trade.inputToken.mint == inputTrade.inputToken.mint) {
                    inputAmount += BigInt(trade.inputToken.amountRaw);
                }
                if (trade.outputToken.mint == outputTrade.outputToken.mint) {
                    outputAmount += BigInt(trade.outputToken.amountRaw);
                }
                if (trade.Pool && trade.Pool.length > 0 && !pools.includes(trade.Pool[0])) {
                    pools.push(trade.Pool[0]);
                }
            }
            inputTrade.inputToken.amountRaw = inputAmount.toString();
            inputTrade.inputToken.amount = (0, types_1.convertToUiAmount)(inputAmount, inputTrade.inputToken.decimals);
            outputTrade.outputToken.amountRaw = outputAmount.toString();
            outputTrade.outputToken.amount = (0, types_1.convertToUiAmount)(outputAmount, outputTrade.outputToken.decimals);
        }
        return {
            type: (0, exports.getTradeType)(inputTrade.inputToken.mint, outputTrade.outputToken.mint),
            Pool: pools,
            inputToken: inputTrade.inputToken,
            outputToken: outputTrade.outputToken,
            user: inputTrade.user,
            programId: inputTrade.programId,
            amm: dexInfo?.amm || inputTrade.amm,
            route: dexInfo?.route || inputTrade.route || '',
            slot: inputTrade.slot,
            timestamp: inputTrade.timestamp,
            signature: inputTrade.signature,
            idx: inputTrade.idx,
        };
    }
    return null;
};
exports.getFinalSwap = getFinalSwap;
//# sourceMappingURL=utils.js.map