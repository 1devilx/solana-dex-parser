import { TradeInfo } from '../../types';
import { BaseParser } from '../base-parser';
export declare class MoonshotParser extends BaseParser {
    processTrades(): TradeInfo[];
    private isTradeInstruction;
    private parseTradeInstruction;
    private detectCollateralMint;
    private calculateAmounts;
    private getTokenBalanceChanges;
    private createTokenAmount;
}
