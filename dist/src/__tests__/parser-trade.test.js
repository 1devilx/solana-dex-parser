"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const dotenv_1 = __importDefault(require("dotenv"));
const dex_parser_1 = require("../dex-parser");
const utils_1 = require("../utils");
const json_bigint_1 = __importDefault(require("json-bigint")); // for bigint serialization in json
dotenv_1.default.config();
describe('Dex Parser', () => {
    let connection;
    beforeAll(async () => {
        // Initialize connection
        const rpcUrl = process.env.SOLANA_RPC_URL;
        if (!rpcUrl) {
            throw new Error('SOLANA_RPC_URL environment variable is not set');
        }
        connection = new web3_js_1.Connection(rpcUrl, {
            commitment: 'confirmed',
            // httpAgent: new https.Agent({ host: '127.0.0.1', port: 7890 }) 
        });
    });
    describe('Parse Trades', () => {
        const parser = new dex_parser_1.DexParser();
        [
            "2YxPyAJNfnBLrVpBwMx7qMVNPSvBDhxiquwJGhBjwXhkP6i6AbooUg4b4wpi15bQq2Qs4t7BpL1UVvTMcXL8P4uS",
            // "3874qjiBkmSNk3rRMEst2fAfwSx9jPNNi3sCcFBxETzEYxpPeRnU9emKz26M2x3ttxJGJmjV4ctZziQMFmDgKBkZ", // multiple signers
            // "3Dd6Hr9AFFearu8MZ8V3Ukm2dAbWLQ3ZUbxTvfLBw1UtghqSc1mEsrgdcbqVYQrfozTy9wNYaHQoE5FqXqfTvHA", // pumpfun
            // "5pBu3T3iguqLpgtKTmhfiik13EruLVKNa28ZMtkrE2hhcM1hM1D7aNn7vgiqQsahFTaw6kiJiPre6suJAJdKrK2y", //pumpswap
            // "4YxPRX9p3rdN7H6cbjC6pKqyQfTu589nkVH3PqxFQyaoP5cZxEgfLK2SJmHFzUTXoJceGtxC8eGXeDqFjLE2UycH", //Boopfun
            // "4x8k2aQKevA8yuCVX1V8EaH2GBqdbZ1dgYxwtkwZJ7SmCQeng7CCs17AvyjFv6nMoUkBgpBwLHAABdCxGHbAWxo4", // raydium launchpad
            // "4WGyuUf65j9ojW6zrKf9zBEQsEfW5WiuKjdh6K2dxQAn7ggMkmT1cn1v9GuFs3Ew1d7oMJGh2z1VNvwdLQqJoC9s" // transfer
        ]
            .forEach((signature) => {
            it(`${signature} `, async () => {
                const tx = await connection.getParsedTransaction(signature, {
                    commitment: 'confirmed',
                    maxSupportedTransactionVersion: 0,
                });
                if (!tx) {
                    throw new Error(`Transaction not found > ${signature}`);
                }
                const { context, fee, trades, liquidities, transfers, solBalanceChange, tokenBalanceChange, moreEvents } = parser.parseAll(tx, {
                    aggregateTrades: false
                });
                // console.log('parseLiquidity> ', parser.parseLiquidity(tx));
                // fs.writeFileSync(`./src/__tests__/tx-${signature}-parsed.json`, JSON.stringify(tx, null, 2));
                const swap = context.utils.attachTradeFee((0, utils_1.getFinalSwap)(trades));
                console.log('fee', fee);
                console.log('solBalanceChange', solBalanceChange, 'tokenBalanceChange', tokenBalanceChange);
                console.log('finalSwap', JSON.stringify(swap, null, 2));
                console.log('trades', JSON.stringify(trades, null, 2));
                console.log('liquidity', liquidities);
                console.log('transfer', JSON.stringify(transfers, null, 2));
                console.log('moreEvents', json_bigint_1.default.stringify(moreEvents, null, 2));
                expect(trades.length + liquidities.length + transfers.length).toBeGreaterThanOrEqual(1);
            });
        });
    });
});
//# sourceMappingURL=parser-trade.test.js.map