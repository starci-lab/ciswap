import { ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { computeDenomination } from "@/utils"
import { aptosSwapResourceAccounts, buildAptosFQN } from "@/config"

export interface GetPoolMetadataParams {
  chainKey: ChainKey;
  network?: Network;
}

export interface PoolMetadata {
    poolCreationFee: number
    nextPoolId: number
}

export const getAptosPoolMetadata = async ({
    network,
}: GetPoolMetadataParams): Promise<PoolMetadata> => {
    const aptosClient = createAptosClient(network)
    const swapInfo = await aptosClient.getAccountResource(
        {
            accountAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
            resourceType: buildAptosFQN({
                network,
                moduleName: "swap",
                functionNameOrResourceType: "SwapInfo",
            }),
        }
    )
    return {
        poolCreationFee: computeDenomination(swapInfo.creation_fee_in_apt, 8),
        nextPoolId: swapInfo.next_pool_id
    }
}

export const getPoolMetadata = (params: GetPoolMetadataParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosPoolMetadata(params)
    }
    throw new Error("Invalid chain key")
}