// import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
// import { createAptosClient } from "@/modules/blockchain"
import { ChainKey, Network } from "@/types/blockchain"
// import { createAptosClient } from "../rpcs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import { createAptosClient } from "../rpcs/aptos"

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
    const apolloClient = new ApolloClient({
        uri: "https://api.testnet.aptoslabs.com/v1/graphql",
        // no-cache
        cache: new InMemoryCache(),
        headers: {
            Authorization: "Bearer AG-94PZPKFXB8ER1PVQ9AZ9OMZI8BO4ZOIW8",
        },
        defaultOptions: {
            query: {
                fetchPolicy: "no-cache", // no cache
            },
            watchQuery: {
                fetchPolicy: "no-cache", // no cache
            },
        },
    })
    const aptosClient = createAptosClient(network)
    const collection =
    await aptosClient.getCollectionDataByCreatorAddressAndCollectionName({
        creatorAddress: APTOS_SWAP_RESOURCE_ACCOUNT,
        collectionName: `CiSwap LP-${poolId}`,
    })
    // make request to indexer
    const { data } = await apolloClient.query({
        query: gql`
      query GetTokenOwnership($ownerAddress: String!, $collectionId: String!) {
        current_token_ownerships_v2(
          where: {
            owner_address: { _eq: $ownerAddress }
            current_token_data: { collection_id: { _eq: $collectionId } }
          }
        ) {
          token_data_id
        }
      }
    `,
        variables: {
            ownerAddress: accountAddress,
            collectionId: collection.collection_id,
        },
    })
    const tokenData = await aptosClient.getDigitalAssetData({digitalAssetAddress: data.current_token_ownerships_v2[0].token_data_id})
    console.log(tokenData)
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
