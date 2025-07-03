import { ChainKey, Network } from "@/types"
import { getTokenMetadata, TokenMetadata } from "../token"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { createAptosClient } from "../rpcs"

export interface GetPoolInfoParams {
  chainKey: ChainKey;
  poolId: number;
  network?: Network;
}

export enum TokenType {
  Token0 = "token0",
  Token1 = "token1",
  TokenDebt0 = "token_debt0",
  TokenDebt1 = "token_debt1",
}

export interface PoolInfo {
  tokenAddresses: Record<TokenType, TokenMetadata>;
  loaded: boolean;
  kSqrtAdded: number;
  globalXFeeGrowthX128: bigint;
  globalYFeeGrowthX128: bigint;
  globalDebtXFeeGrowthX128: bigint;
  globalDebtYFeeGrowthX128: bigint;
}

interface MoveTokenPairMetadata {
  creator: string; // Address of the user who created the pair (admin for this pair)
  k_sqrt_last: number; // Last recorded sqrt(K) for fee calculation (used for fee distribution)
  k_sqrt_locked: number; // Last recorded sqrt(K) for locked liquidity
  global_x_fee_growth_x128: bigint; // Global fee growth for the pair (used for fee distribution)
  global_y_fee_growth_x128: bigint; // Global fee growth for the pair (used for fee distribution)
  global_debt_x_fee_growth_x128: bigint; // Global fee growth for virtual X (used for fee distribution)
  global_debt_y_fee_growth_x128: bigint; // Global fee growth for virtual Y (used for fee distribution)
}

// -----------------------------------------------------------------------------
// Aptos
// -----------------------------------------------------------------------------
export const getAptosPoolInfo = async ({
    network,
    poolId,
}: GetPoolInfoParams): Promise<PoolInfo> => {
    const aptosClient = createAptosClient(network)

    // 1. Lấy địa chỉ 4 token trong pool
    const [token0, token1, tokenDebt0, tokenDebt1] = await aptosClient.view<
    [string, string, string, string]
  >({
      payload: {
          function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::quoter::get_tokens`,
          typeArguments: [],
          functionArguments: [poolId],
      },
  })

    // 2. Map token‑type → address để duyệt dễ hơn
    const addressByType: Record<TokenType, string> = {
        [TokenType.Token0]: token0,
        [TokenType.Token1]: token1,
        [TokenType.TokenDebt0]: tokenDebt0,
        [TokenType.TokenDebt1]: tokenDebt1,
    }

    // 3. Lấy metadata song song
    const entries = await Promise.all(
        (Object.keys(addressByType) as Array<keyof typeof addressByType>).map(async (tokenType) => {
            const metadata = await getTokenMetadata({
                chainKey: ChainKey.Aptos,
                tokenAddress: addressByType[tokenType],
                network,
            })
            return [tokenType, metadata] as [TokenType, TokenMetadata]
        })
    )

    const tokenAddresses = Object.fromEntries(entries) as Record<
    TokenType,
    TokenMetadata
  >

    const tokenPairMetadatas = await aptosClient.getAccountResource({
        accountAddress: APTOS_SWAP_RESOURCE_ACCOUNT,
        resourceType: `${APTOS_SWAP_RESOURCE_ACCOUNT}::swap::TokenPairMetadatas`,
    })
    const tokenPairMetadata =
    await aptosClient.table.getTableItem<MoveTokenPairMetadata>({
        handle: tokenPairMetadatas.metadatas.handle,
        data: {
            key: poolId.toString(),
            key_type: "u64",
            value_type: `${APTOS_SWAP_RESOURCE_ACCOUNT}::swap::TokenPairMetadata`,
        },
    })
    console.log(tokenPairMetadata)

    return {
        tokenAddresses,
        loaded: true,
        kSqrtAdded: tokenPairMetadata.k_sqrt_last - tokenPairMetadata.k_sqrt_locked,
        globalXFeeGrowthX128: BigInt(tokenPairMetadata.global_x_fee_growth_x128),
        globalYFeeGrowthX128: BigInt(tokenPairMetadata.global_y_fee_growth_x128),
        globalDebtXFeeGrowthX128: BigInt(tokenPairMetadata.global_debt_x_fee_growth_x128),
        globalDebtYFeeGrowthX128: BigInt(tokenPairMetadata.global_debt_y_fee_growth_x128),
    }
}

// -----------------------------------------------------------------------------
// Router cho đa chain (mở đường sẵn cho sau này)
// -----------------------------------------------------------------------------
export const getPoolInfo = (params: GetPoolInfoParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosPoolInfo(params)
    default:
        throw new Error("Invalid chain key")
    }
}
