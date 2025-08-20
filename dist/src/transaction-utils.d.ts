import { InstructionClassifier } from './instruction-classifier';
import { TransactionAdapter } from './transaction-adapter';
import { DexInfo, PoolEvent, TokenInfo, TradeInfo, TransferData, TransferInfo } from './types';
export declare class TransactionUtils {
    private adapter;
    constructor(adapter: TransactionAdapter);
    /**
     * Get DEX information from transaction
     */
    getDexInfo(classifier: InstructionClassifier): DexInfo;
    /**
     * Get transfer actions from transaction
     */
    getTransferActions(extraTypes?: string[]): Record<string, TransferData[]>;
    processTransferInstructions(outerIndex: number, extraTypes?: string[]): TransferData[];
    /**
     * Parse instruction actions (both parsed and compiled)
     * actions: transfer/transferCheced/mintTo/burn
     */
    parseInstructionAction(instruction: any, idx: string, extraTypes?: string[]): TransferData | null;
    /**
     * Parse parsed instruction
     */
    parseParsedInstructionAction(instruction: any, idx: string, extraTypes?: string[]): TransferData | null;
    /**
     * Parse compiled instruction
     */
    parseCompiledInstructionAction(instruction: any, idx: string, extraTypes?: string[]): TransferData | null;
    /**
     * Get mint from instruction
     */
    getMintFromInstruction(ix: any, info: any): string | undefined;
    /**
     * Get token amount from instruction info
     */
    getTokenAmount(info: any, decimals: number): any;
    /**
     * Check if program should be ignored for grouping
     */
    isIgnoredProgram(programId: string): boolean;
    /**
     * Get transfer info from transfer data
     */
    getTransferInfo(transferData: TransferData, timestamp: number, signature: string): TransferInfo | null;
    /**
     * Get transfer info list from transfer data
     */
    getTransferInfoList(transferDataList: TransferData[]): TransferInfo[];
    /**
     * Process swap data from transfers
     */
    processSwapData(transfers: TransferData[], dexInfo: DexInfo): TradeInfo | null;
    /**
     * Get signer for swap transaction
     */
    getSwapSigner(): string;
    /**
     * Extract unique tokens from transfers
     */
    private extractUniqueTokens;
    /**
     * Calculate token amounts for swap
     */
    private calculateTokenAmounts;
    /**
     * Sum token amounts from transfers
     */
    private sumTokenAmounts;
    /**
     * Get token info from transfer data
     */
    getTransferTokenInfo(transfer: TransferData): TokenInfo | null;
    /**
     * Sort and get LP tokens
     * make sure token0 is SPL Token, token1 is SOL/USDC/USDT
     * SOL,USDT > buy
     * SOL,DDD > buy
     * USDC,USDT/DDD > buy
     * USDT,USDC
     * DDD,USDC > sell
     * USDC,SOL > sell
     * USDT,SOL > sell
     * @param transfers
     * @returns
     */
    getLPTransfers: (transfers: TransferData[]) => TransferData[];
    attachTokenTransferInfo: (trade: TradeInfo, transferActions: Record<string, TransferData[]>) => TradeInfo;
    attachUserBalanceToLPs: (liquidities: PoolEvent[]) => PoolEvent[];
    attachTradeFee(trade: TradeInfo | null): TradeInfo | null;
}
