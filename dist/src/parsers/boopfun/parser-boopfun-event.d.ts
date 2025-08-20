import { TransactionAdapter } from '../../transaction-adapter';
import { BoopfunEvent, ClassifiedInstruction, TransferData } from '../../types';
/**
 * Parse Boopfun events (CREATE/BUY/SELL/COMPLETE)
 */
export declare class BoopfunEventParser {
    private readonly adapter;
    private readonly transferActions;
    constructor(adapter: TransactionAdapter, transferActions: Record<string, TransferData[]>);
    private readonly eventParsers;
    processEvents(): BoopfunEvent[];
    parseInstructions(instructions: ClassifiedInstruction[]): BoopfunEvent[];
    private decodeBuyEvent;
    private decodeSellEvent;
    private decodeCreateEvent;
    private decodeCompleteEvent;
    protected getTransfersForInstruction(programId: string, outerIndex: number, innerIndex?: number): TransferData[];
}
