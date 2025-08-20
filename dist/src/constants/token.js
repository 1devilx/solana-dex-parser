"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_DECIMALS = exports.TOKENS = void 0;
// Known token addresses
exports.TOKENS = {
    NATIVE: '11111111111111111111111111111111',
    SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};
exports.TOKEN_DECIMALS = {
    [exports.TOKENS.SOL]: 9,
    [exports.TOKENS.USDC]: 6,
    [exports.TOKENS.USDT]: 6,
};
//# sourceMappingURL=token.js.map