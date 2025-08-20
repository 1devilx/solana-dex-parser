import base58 from 'bs58';
import { deserializeUnchecked, Schema } from 'borsh';
import { PoolStatus, RaydiumLCPTradeEvent, TradeDirection } from '../../../types/raydium';

export class TradeDirectionClass {
  variant: 'Buy' | 'Sell';
  constructor(fields: { variant: 'Buy' | 'Sell' }) {
    this.variant = fields.variant;
  }
}

export const TradeDirectionSchema: Schema = new Map([
  [
    TradeDirectionClass,
    {
      kind: 'enum',
      values: [
        ['Buy', {}],
        ['Sell', {}],
      ],
    },
  ],
]);

export class RaydiumLCPTradeLayout {
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
  tradeDirection: TradeDirectionClass;
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
    tradeDirection: TradeDirectionClass;
    poolStatus: PoolStatus;
  }) {
    this.poolState = fields.poolState;
    this.totalBaseSell = fields.totalBaseSell;
    this.virtualBase = fields.virtualBase;
    this.virtualQuote = fields.virtualQuote;
    this.realBaseBefore = fields.realBaseBefore;
    this.realQuoteBefore = fields.realQuoteBefore;
    this.realBaseAfter = fields.realBaseAfter;
    this.realQuoteAfter = fields.realQuoteAfter;
    this.amountIn = fields.amountIn;
    this.amountOut = fields.amountOut;
    this.protocolFee = fields.protocolFee;
    this.platformFee = fields.platformFee;
    this.shareFee = fields.shareFee;
    this.tradeDirection = fields.tradeDirection;
    this.poolStatus = fields.poolStatus;
  }

  static schema: Schema = new Map([
    [
      RaydiumLCPTradeLayout,
      {
        kind: 'struct',
        fields: [
          ['poolState', [32]],
          ['totalBaseSell', 'u64'],
          ['virtualBase', 'u64'],
          ['virtualQuote', 'u64'],
          ['realBaseBefore', 'u64'],
          ['realQuoteBefore', 'u64'],
          ['realBaseAfter', 'u64'],
          ['realQuoteAfter', 'u64'],
          ['amountIn', 'u64'],
          ['amountOut', 'u64'],
          ['protocolFee', 'u64'],
          ['platformFee', 'u64'],
          ['shareFee', 'u64'],
          ['tradeDirection', TradeDirectionClass],
          ['poolStatus', 'u8'],
        ],
      },
    ],
    ...TradeDirectionSchema,
  ]);

  static fromBuffer(buffer: Buffer): RaydiumLCPTradeLayout {
    return deserializeUnchecked(RaydiumLCPTradeLayout.schema, RaydiumLCPTradeLayout, buffer);
  }

  toObject(): RaydiumLCPTradeEvent {
    return {
      poolState: base58.encode(this.poolState),
      totalBaseSell: this.totalBaseSell,
      virtualBase: this.virtualBase,
      virtualQuote: this.virtualQuote,
      realBaseBefore: this.realBaseBefore,
      realQuoteBefore: this.realQuoteBefore,
      realBaseAfter: this.realBaseAfter,
      amountIn: this.amountIn,
      amountOut: this.amountOut,
      protocolFee: this.protocolFee,
      platformFee: this.platformFee,
      shareFee: this.shareFee,
      tradeDirection: this.tradeDirection.variant === 'Buy' ? TradeDirection.Buy : TradeDirection.Sell,
      poolStatus: this.poolStatus,
      baseMint: '',
      quoteMint: '',
      user: '',
    };
  }
}
