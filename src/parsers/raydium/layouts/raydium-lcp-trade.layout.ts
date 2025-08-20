import base58 from 'bs58';
import { deserializeUnchecked, Schema } from 'borsh';
import { PoolStatus, RaydiumLCPTradeEvent, TradeDirection } from '../../../types/raydium';

// Borsh-compatible enum variant classes
export class Buy {}
export class Sell {}

// Enum wrapper
export class TradeDirectionClass {}

// Borsh schema for enum
export const TradeDirectionSchema: Schema = new Map([
  [
    TradeDirectionClass,
    {
      kind: 'enum',
      values: [
        ['Buy', Buy],
        ['Sell', Sell],
      ],
    },
  ],
  [Buy, { kind: 'struct', fields: [] }],
  [Sell, { kind: 'struct', fields: [] }],
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
  tradeDirection: Buy | Sell;
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
    tradeDirection: Buy | Sell;
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
    const tradeDir = this.tradeDirection instanceof Buy ? TradeDirection.Buy : TradeDirection.Sell;

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
      tradeDirection: tradeDir,
      poolStatus: this.poolStatus,
      baseMint: '',
      quoteMint: '',
      user: '',
    };
  }
}
