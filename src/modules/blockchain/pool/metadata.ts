import { ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeDenomination } from "@/utils"

export interface GetPoolMetadataParams {
  chainKey: ChainKey;
  network?: Network;
}

export interface PoolMetadata {
    poolCreationFee: number
}

export const getAptosPoolMetadata = async ({
    network,
}: GetPoolMetadataParams): Promise<PoolMetadata> => {
    const aptosClient = createAptosClient(network)
    const swapInfo = await aptosClient.getAccountResource(
        {
            accountAddress: APTOS_SWAP_RESOURCE_ACCOUNT,
            resourceType: `${APTOS_SWAP_RESOURCE_ACCOUNT}::swap::SwapInfo`,
        }
    )
    return {
        poolCreationFee: computeDenomination(swapInfo.creation_fee_in_apt, 8)
    }
}

export const getPoolMetadata = (params: GetPoolMetadataParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosPoolMetadata(params)
    }
    throw new Error("Invalid chain key")
}