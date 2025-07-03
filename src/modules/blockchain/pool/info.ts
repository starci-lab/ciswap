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
        (Object.keys(addressByType) as TokenType[]).map(async (tokenType) => {
            const metadata = await getTokenMetadata({
                chainKey: ChainKey.Aptos,
                tokenAddress: addressByType[tokenType],
                network,
            })
            return [tokenType, metadata] as [TokenType, TokenMetadata]
        }),
    )

    const tokenAddresses = Object.fromEntries(entries) as Record<
    TokenType,
    TokenMetadata
  >

    return { tokenAddresses, loaded: true }
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