import { TransactionAdapter } from './transaction-adapter';
import { ClassifiedInstruction } from './types/common';
export declare class InstructionClassifier {
    private adapter;
    private instructionMap;
    constructor(adapter: TransactionAdapter);
    private classifyInstructions;
    private addInstruction;
    getInstructions(programId: string): ClassifiedInstruction[];
    getAllProgramIds(): string[];
}
