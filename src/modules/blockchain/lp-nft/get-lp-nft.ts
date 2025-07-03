// import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
// import { createAptosClient } from "@/modules/blockchain"
import { ChainKey, Network } from "@/types/blockchain"

export interface GetLPNFTParams {
  chainKey: ChainKey;
  network?: Network;
  poolId: number;
  accountAddress: string;
}

export interface GetLPNFTResponse {
  position: number;
}

export const getAptosLPNFT = async ({
    network,
    poolId,
    accountAddress,
}: GetLPNFTParams): Promise<GetLPNFTResponse> => {
    console.log(network, poolId, accountAddress)
    // const client = createAptosClient(network)
    // const collectionMetadatas = await client.getAccountResource({
    //     accountAddress: APTOS_SWAP_RESOURCE_ACCOUNT,
    //     resourceType: `${APTOS_SWAP_RESOURCE_ACCOUNT}::position::CollectionMetadatas`,
    // })
    // const collectionMetadata = await client.table.getTableItem({
    //     handle: collectionMetadatas.metadatas.handle,
    //     data: {
    //         key: poolId.toString(),
    //         key_type: "u64",
    //         value_type: `${APTOS_SWAP_RESOURCE_ACCOUNT}::position::CollectionMetadata`,
    //     }
    // })
    return {
        position: 0,
    }
}

export const getLPNFT = async (
    params: GetLPNFTParams
): Promise<GetLPNFTResponse> => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosLPNFT(params)
    default:
        throw new Error(`Unsupported chain key: ${params.chainKey}`)
    }
}
