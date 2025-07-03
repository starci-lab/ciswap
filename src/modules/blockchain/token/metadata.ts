import { ChainKey, Network, TokenKey } from "@/types"
import { createAptosClient } from "../rpcs"
import { GetFungibleAssetMetadataResponse } from "@aptos-labs/ts-sdk"

export interface GetTokenMetadataParams {
  chainKey: ChainKey;
  //use token address incase you want to get balance of a specific token
  tokenAddress?: string;
  //use tokenKey incase you want to get balance of a defined token, if tokenKey is set, tokenAddress will be ignored
  tokenKey?: TokenKey;
  network?: Network;
  isTypeTag?: boolean;
}

export interface TokenMetadata {
    name: string
    symbol: string
    decimals: number
    imageUrl: string
    tokenAddress?: string
}

export const getAptosTokenMetadata = async ({
    tokenAddress,
    network,
    isTypeTag,
}: GetTokenMetadataParams): Promise<TokenMetadata> => {
    if (!tokenAddress)
        throw new Error("Cannot find token metadata without token address")
    const aptosClient = createAptosClient(network)
    let tokenMetadata: GetFungibleAssetMetadataResponse[0]
    if (isTypeTag) {
        tokenMetadata = await aptosClient.getFungibleAssetMetadataByAssetType({ 
            assetType: tokenAddress,
        })
    } else {
        const metadata = await aptosClient.view({
            payload: {
                function: "0x1::fungible_asset::metadata",
                functionArguments: [tokenAddress],
                typeArguments: ["0x1::object::ObjectCore"],
            },
        })
        tokenMetadata = metadata[0] as GetFungibleAssetMetadataResponse[0]
    }
    const { name, symbol, decimals, icon_uri } = tokenMetadata
    return {
        name,
        symbol,
        decimals,
        imageUrl: icon_uri || "",
        tokenAddress,
    }
}

export const getTokenMetadata = (params: GetTokenMetadataParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosTokenMetadata(params)
    }
    throw new Error("Invalid chain key")
}