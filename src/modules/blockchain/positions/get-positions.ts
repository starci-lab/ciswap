// import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
// import { createAptosClient } from "@/modules/blockchain"
import { AptosMoveTableHandle, ChainKey, Network } from "@/types/blockchain"

import { gql } from "@apollo/client"
import { createAptosClient, createAptosIndexerApolloClient } from "../rpcs/aptos"
import { aptosSwapResourceAccounts, buildAptosFQN } from "@/config"

export interface GetPositionsParams {
  chainKey: ChainKey;
  network?: Network;
  poolId: number;
  accountAddress: string;
}

export interface Position {
  poolId: number; // Pool this position belongs to
  kSqrtAdded: number; // Amount of liquidity provided (sqrt K)
  xFeeGrowthInsideX128: string; // Fee growth for X at the time of mint
  yFeeGrowthInsideX128: string; // Fee growth for Y at the time of mint
  debtXFeeGrowthInsideX128: string; // Fee growth for virtual X at the time of mint
  debtYFeeGrowthInsideX128: string; // Fee growth for virtual Y at the time of mint
  name: string; // Name of the NFT
  nftAddress: string; // NFT address
}

export interface AptosMovePosition {
    pool_id: number, // Pool this position belongs to
    k_sqrt_added: number, // Amount of liquidity provided (sqrt K)
    x_fee_growth_inside_x128: string, // Fee growth for X at the time of mint
    y_fee_growth_inside_x128: string, // Fee growth for Y at the time of mint
    debt_x_fee_growth_inside_x128: string, // Fee growth for virtual X at the time of mint
    debt_y_fee_growth_inside_x128: string, // Fee growth for virtual Y at the time of mint
}

export interface GetPositionsResponse {
  positions: Array<Position>;
}

export interface AptosMoveMetadatas {
    metadatas: AptosMoveTableHandle
}

export interface AptosMoveCollectionMetadata {
    collection_addr: string, // Address of the collection
    name: string, // Name of the collection
    positions: AptosMoveTableHandle
    next_nft_id: number // Next NFT ID to use for minting
}

export const getAptosPositions = async ({
    network,
    poolId,
    accountAddress,
}: GetPositionsParams): Promise<GetPositionsResponse> => {
    // define clients
    const aptosIndexerApolloClient = createAptosIndexerApolloClient(network)
    const aptosClient = createAptosClient(network)
    // fetch collection data
    const collection =
    await aptosClient.getCollectionDataByCreatorAddressAndCollectionName({
        creatorAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
        collectionName: `CiSwap LP-${poolId}`,
    })
    // make request to indexer
    const { data } = await aptosIndexerApolloClient.query({
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
    // get the metadatas for the collection
    const metadatas = await aptosClient.getAccountResource<AptosMoveMetadatas>({
        accountAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
        resourceType: buildAptosFQN({
            network,
            moduleName: "position",
            functionNameOrResourceType: "CollectionMetadatas",
        }),
    })
    // get the metadata for the collection
    const metadata = await aptosClient.table.getTableItem<AptosMoveCollectionMetadata>({
        handle: metadatas.metadatas.handle,
        data: {
            key: poolId.toString(),
            key_type: "u64",
            value_type: buildAptosFQN({
                network,
                moduleName: "position",
                functionNameOrResourceType: "CollectionMetadata",
            }),
        }
    })
    const positions: Array<Position> = []
    const promises: Array<Promise<void>> = []
    for (const item of data.current_token_ownerships_v2) {
        const promise = async () => {
            const tokenData = await aptosClient.getDigitalAssetData({
                digitalAssetAddress: item.token_data_id,
            })
            const position = await aptosClient.table.getTableItem<AptosMovePosition>({
                handle: metadata.positions.handle,
                data: {
                    key: tokenData.token_data_id,
                    key_type: "address",
                    value_type: buildAptosFQN({
                        network,
                        moduleName: "position",
                        functionNameOrResourceType: "Position",
                    }),
                }
            })
            positions.push({
                name: item.current_token_data.token_name,
                nftAddress: tokenData.token_data_id,
                kSqrtAdded: position.k_sqrt_added,
                xFeeGrowthInsideX128: position.x_fee_growth_inside_x128,
                yFeeGrowthInsideX128: position.y_fee_growth_inside_x128,
                debtXFeeGrowthInsideX128: position.debt_x_fee_growth_inside_x128,
                debtYFeeGrowthInsideX128: position.debt_y_fee_growth_inside_x128,
                poolId: poolId,
            })
        }
        promises.push(promise())
    }
    await Promise.all(promises)
    return {
        positions,
    }
}

export const getPositions = async (
    params: GetPositionsParams
): Promise<GetPositionsResponse> => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosPositions(params)
    default:
        throw new Error(`Unsupported chain key: ${params.chainKey}`)
    }
}
