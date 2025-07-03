import { createAptosClient } from "@/modules/blockchain"
import { ChainKey } from "@/types/blockchain"

export interface GetLPNFTParams {
    chainKey: ChainKey
    poolId: number
}

export const getLPNFT = async (params: GetLPNFTParams) => {
    const { chainKey, poolId } = params
    const client = createAptosClient(chainKey, Network.Testnet)
    const lpNFT = await client.getLPNFT(poolId)
    return lpNFT
}