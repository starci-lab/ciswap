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

export interface Position {
  poolId: number; // Pool this position belongs to
  kSqrtAdded: number; // Amount of liquidity provided (sqrt K)
  feeGrowthInsideX128: bigint; // Fee growth for X at the time of mint
  feeGrowthInsideY128: bigint; // Fee growth for Y at the time of mint
  feeGrowthInsideDebtX128: bigint; // Fee growth for virtual X at the time of mint
  feeGrowthInsideDebtY128: bigint; // Fee growth for virtual Y at the time of mint
  name: string; // Name of the NFT
  tokenId: string; // Token ID of the NFT
}

export interface MovePosition {
  k_sqrt_added: number; // Amount of liquidity provided (sqrt K)
  fee_growth_inside_x: number; // Fee growth for X at the time of mint
  fee_growth_inside_y: number; // Fee growth for Y at the time of mint
  fee_growth_inside_debt_x: number; // Fee growth for virtual X at the time of mint
  fee_growth_inside_debt_y: number; // Fee growth for virtual Y at the time of mint
}

export interface GetLPNFTResponse {
  positions: Array<Position>;
}

export interface CollectionMetadata {
    collection_addr: string, // Address of the collection
    name: string, // Name of the collection
    positions: {
        handle: string,
    }
    next_nft_id: number // Next NFT ID to use for minting
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
          current_token_data {
            token_name
          }
        }
      }
    `,
        variables: {
            ownerAddress: accountAddress,
            collectionId: collection.collection_id,
        },
    })
    const metadatas = await aptosClient.getAccountResource({
        accountAddress: APTOS_SWAP_RESOURCE_ACCOUNT,
        resourceType: `${APTOS_SWAP_RESOURCE_ACCOUNT}::position::CollectionMetadatas`,
    })
    const metadata = await aptosClient.table.getTableItem<CollectionMetadata>({
        handle: metadatas.metadatas.handle,
        data: {
            key: poolId.toString(),
            key_type: "u64",
            value_type: `${APTOS_SWAP_RESOURCE_ACCOUNT}::position::CollectionMetadata`,
        }
    })
    const positionsHandle = metadata.positions.handle
    const positions: Array<Position> = []
    const promises: Array<Promise<void>> = []
    for (const item of data.current_token_ownerships_v2) {
        const promise = async () => {
            const tokenData = await aptosClient.getDigitalAssetData({
                digitalAssetAddress: item.token_data_id,
            })
            const position = await aptosClient.table.getTableItem<MovePosition>({
                handle: positionsHandle,
                data: {
                    key: tokenData.token_data_id,
                    key_type: "address",
                    value_type: `${APTOS_SWAP_RESOURCE_ACCOUNT}::position::Position`,
                }
            })
            positions.push({
                name: item.current_token_data.token_name,
                tokenId: tokenData.token_data_id,
                kSqrtAdded: position.k_sqrt_added,
                feeGrowthInsideX128: BigInt(position.fee_growth_inside_x),
                feeGrowthInsideY128: BigInt(position.fee_growth_inside_y),
                feeGrowthInsideDebtX128: BigInt(position.fee_growth_inside_debt_x),
                feeGrowthInsideDebtY128: BigInt(position.fee_growth_inside_debt_y),
                poolId: poolId,
            })
        }
        promises.push(promise())
    }
    await Promise.all(promises)
    console.log(positions)
    return {
        positions,
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
