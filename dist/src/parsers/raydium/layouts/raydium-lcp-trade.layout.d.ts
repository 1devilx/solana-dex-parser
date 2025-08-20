import { Schema } from 'borsh';
import { PoolStatus, RaydiumLCPTradeEvent } from '../../../types/raydium';
export declare class RaydiumLCPTradeLayout {
    poolState: Uint8Array;
    totalBaseSell: bigint;
    virtualBase: bigint;
    virtualQuote: bigint;
    realBaseBefore: bigint;
    realQuoteBefore: bigint;
    realBaseAfter: bigint;
    realQuoteAfter: bigint;
    amountIn: bigint;
    amountOut: bigint;
    protocolFee: bigint;
    platformFee: bigint;
    shareFee: bigint;
    tradeDirection: number;
    poolStatus: PoolStatus;
    constructor(fields: {
        poolState: Uint8Array;
        totalBaseSell: bigint;
        virtualBase: bigint;
        virtualQuote: bigint;
        realBaseBefore: bigint;
        realQuoteBefore: bigint;
        realBaseAfter: bigint;
        realQuoteAfter: bigint;
        amountIn: bigint;
        amountOut: bigint;
        protocolFee: bigint;
        platformFee: bigint;
        shareFee: bigint;
        tradeDirection: number;
        poolStatus: PoolStatus;
    });
    static schema: Schema;
    static fromBuffer(buffer: Buffer): RaydiumLCPTradeLayout;
    toObject(): RaydiumLCPTradeEvent;
}
