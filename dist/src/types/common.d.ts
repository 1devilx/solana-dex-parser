import { TransactionAdapter } from '../transaction-adapter';
import { TransactionUtils } from '../transaction-utils';
import { PoolEvent } from './pool';
import { TokenAmount, TradeInfo, TransferData } from './trade';
export interface ClassifiedInstruction {
    instruction: any;
    programId: string;
    outerIndex: number;
    innerIndex?: number;
}
export interface BalanceChange {
    pre: TokenAmount;
    post: TokenAmount;
    change: TokenAmount;
}
export interface ParseResult {
    state: boolean;
    fee: TokenAmount;
    trades: TradeInfo[];
    liquidities: PoolEvent[];
    transfers: TransferData[];
    solBalanceChange?: BalanceChange;
    tokenBalanceChange?: Map<string, BalanceChange>;
    moreEvents: Record<string, any[]>;
    msg?: string;
    context: {
        utils: TransactionUtils;
        adapter: TransactionAdapter;
    };
}
export interface ParseShredResult {
    state: boolean;
    signature: string;
    instructions: Record<string, any[]>;
    msg?: string;
}
export type EventParser<T> = {
    discriminator: Buffer | Uint8Array;
    decode: (data: Buffer) => T;
};
export type EventsParser<T> = {
    discriminators: (Buffer | Uint8Array)[];
    slice: number;
    decode: (data: Buffer, options: any) => T;
};
export type InstructionParser<T> = {
    discriminator: Buffer | Uint8Array;
    decode: (instruction: any, options: any) => T;
};
