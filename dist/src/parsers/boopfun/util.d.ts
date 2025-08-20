import { BoopfunTradeEvent, DexInfo, TradeInfo } from '../../types';
export declare const getBoopfunTradeInfo: (event: BoopfunTradeEvent, info: {
    slot: number;
    signature: string;
    timestamp: number;
    idx?: string;
    dexInfo?: DexInfo;
}) => TradeInfo;
