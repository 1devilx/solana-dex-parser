import { DexInfo, RaydiumLCPTradeEvent, TradeInfo } from '../../types';
export declare const getRaydiumTradeInfo: (event: RaydiumLCPTradeEvent, inputToken: {
    mint: string;
    decimals: number;
}, outputToken: {
    mint: string;
    decimals: number;
}, info: {
    slot: number;
    signature: string;
    timestamp: number;
    idx?: string;
    dexInfo?: DexInfo;
}) => TradeInfo;
