import { TransactionAdapter } from '../../transaction-adapter';
import { ClassifiedInstruction, RaydiumLCPEvent } from '../../types';
export declare class RaydiumLaunchpadEventParser {
    private readonly adapter;
    constructor(adapter: TransactionAdapter);
    private readonly EventsParsers;
    processEvents(): RaydiumLCPEvent[];
    parseInstructions(instructions: ClassifiedInstruction[]): RaydiumLCPEvent[];
    private decodeTradeInstruction;
    private decodeCreateEvent;
    private decodeCompleteInstruction;
}
