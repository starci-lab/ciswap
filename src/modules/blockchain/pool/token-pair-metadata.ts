import {
    AptosMoveObject,
    AptosMoveTableHandle,
    ChainKey,
    Network,
} from "@/types"
import { createAptosClient } from "../rpcs"
import { aptosSwapResourceAccounts, buildAptosSwapFQN } from "@/config"

export interface GetTokenPairMetadataParams {
  chainKey: ChainKey;
  network?: Network;
  poolId: number;
}

export interface AptosMoveTokenPairMetadata {
  creator: string; // Address of the user who created the pair (admin for this pair)
  k_sqrt_last: number; // Last recorded sqrt(K) for fee calculation (used for fee distribution)
  k_sqrt_locked: number; // Last recorded sqrt(K) for locked liquidity
  global_x_fee_growth_x128: string; // Global fee growth for the pair (used for fee distribution)
  global_y_fee_growth_x128: string; // Global fee growth for the pair (used for fee distribution)
  global_debt_x_fee_growth_x128: string; // Global fee growth for virtual X (used for fee distribution)
  global_debt_y_fee_growth_x128: string; // Global fee growth for virtual Y (used for fee distribution)
  store_x: AptosMoveObject; // Store of token X
  store_y: AptosMoveObject; // Store of token Y
  store_debt_x: AptosMoveObject; // Store of virtual X
  store_debt_y: AptosMoveObject; // Store of virtual Y
}

export interface AptosMoveTokenPairMetadatas {
  metadatas: AptosMoveTableHandle;
}

export interface TokenPairMetadata {
  creatorAddress: string;
  kSqrtLast: number;
  kSqrtLocked: number;
  kSqrtAdded: number;
  globalXFeeGrowthX128: string;
  globalYFeeGrowthX128: string;
  globalDebtXFeeGrowthX128: string;
  globalDebtYFeeGrowthX128: string;
}

export const getAptosTokenPairMetadata = async ({
    network,
    poolId,
}: GetTokenPairMetadataParams): Promise<TokenPairMetadata> => {
    const aptosClient = createAptosClient(network)
    const tokenPairMetadatas =
    await aptosClient.getAccountResource<AptosMoveTokenPairMetadatas>({
        accountAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
        resourceType: buildAptosSwapFQN({
            network,
            moduleName: "swap",
            functionNameOrResourceType: "TokenPairMetadatas",
        }),
    })
    const tokenPairMetadata =
    await aptosClient.getTableItem<AptosMoveTokenPairMetadata>({
        handle: tokenPairMetadatas.metadatas.handle,
        data: {
            key: poolId.toString(),
            key_type: "u64",
            value_type: buildAptosSwapFQN({
                network,
                moduleName: "swap",
                functionNameOrResourceType: "TokenPairMetadata",
            }),
        },
    })
    console.log({
        creatorAddress: tokenPairMetadata.creator,
        kSqrtLast: Number(tokenPairMetadata.k_sqrt_last),
        kSqrtLocked: Number(tokenPairMetadata.k_sqrt_locked),
        kSqrtAdded: Number(tokenPairMetadata.k_sqrt_last) - Number(tokenPairMetadata.k_sqrt_locked),
        globalXFeeGrowthX128: tokenPairMetadata.global_x_fee_growth_x128,
        globalYFeeGrowthX128: tokenPairMetadata.global_y_fee_growth_x128,
        globalDebtXFeeGrowthX128: tokenPairMetadata.global_debt_x_fee_growth_x128,
        globalDebtYFeeGrowthX128: tokenPairMetadata.global_debt_y_fee_growth_x128,
    })
    return {
        creatorAddress: tokenPairMetadata.creator,
        kSqrtLast: Number(tokenPairMetadata.k_sqrt_last),
        kSqrtLocked: Number(tokenPairMetadata.k_sqrt_locked),
        kSqrtAdded: Number(tokenPairMetadata.k_sqrt_last) - Number(tokenPairMetadata.k_sqrt_locked),
        globalXFeeGrowthX128: tokenPairMetadata.global_x_fee_growth_x128,
        globalYFeeGrowthX128: tokenPairMetadata.global_y_fee_growth_x128,
        globalDebtXFeeGrowthX128: tokenPairMetadata.global_debt_x_fee_growth_x128,
        globalDebtYFeeGrowthX128: tokenPairMetadata.global_debt_y_fee_growth_x128,
    }
}

export const getTokenPairMetadata = async (params: GetTokenPairMetadataParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return await getAptosTokenPairMetadata(params)
    }
    throw new Error("Invalid chain key")
}
