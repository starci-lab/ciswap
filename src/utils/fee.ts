import { computeDenomination } from "./math"

export interface GetFeeParams {
  globalFeeGrowthX128: bigint;
  feeGrowthInsideX128: bigint;
  kSqrtAdded: number;
  factor?: number;
  decimals?: number;
}
export const TWO_POW_SIXTY_FOUR = BigInt("18446744073709551616")
export const getFee = ({
    globalFeeGrowthX128,
    feeGrowthInsideX128,
    kSqrtAdded,
    factor = 5,
    decimals = 8,
}: GetFeeParams) => {
    const scale = 10 ** factor
    const fee =
    (BigInt(kSqrtAdded) *
      (globalFeeGrowthX128 - feeGrowthInsideX128) *
      BigInt(scale)) /
    TWO_POW_SIXTY_FOUR
    const rawBigInt = fee / BigInt(scale)
    return computeDenomination(rawBigInt, decimals)
}
