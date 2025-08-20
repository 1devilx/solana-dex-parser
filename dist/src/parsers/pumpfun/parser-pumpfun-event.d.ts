import { TransactionAdapter } from '../../transaction-adapter';
import { ClassifiedInstruction, PumpfunEvent } from '../../types';
export declare class PumpfunEventParser {
    private readonly adapter;
    constructor(adapter: TransactionAdapter);
    private readonly eventParsers;
    processEvents(): PumpfunEvent[];
    parseInstructions(instructions: ClassifiedInstruction[]): PumpfunEvent[];
    private decodeTradeEvent;
    private decodeCreateEvent;
    private decodeCompleteEvent;
}
