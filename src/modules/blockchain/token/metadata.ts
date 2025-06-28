import { ChainKey, Network, TokenKey } from "@/types"
import { createAptosClient } from "../rpcs"

export interface GetTokenMetadataParams {
  chainKey: ChainKey;
  //use token address incase you want to get balance of a specific token
  tokenAddress?: string;
  //use tokenKey incase you want to get balance of a defined token, if tokenKey is set, tokenAddress will be ignored
  tokenKey?: TokenKey;
  network?: Network;
}

export interface TokenMetadata {
    name: string
    symbol: string
    decimals: number
    imageUrl: string
}

export const getAptosTokenMetadata = async ({
    tokenAddress,
    network,
}: GetTokenMetadataParams): Promise<TokenMetadata> => {
    if (!tokenAddress)
        throw new Error("Cannot find token metadata without token address")
    const aptosClient = createAptosClient(network)
    const tokenMetadata = await aptosClient.getFungibleAssetMetadataByAssetType({ assetType: tokenAddress })
    const { name, symbol, decimals, icon_uri } = tokenMetadata
    return {
        name,
        symbol,
        decimals,
        imageUrl: icon_uri || "",
    }
}

export const getTokenMetadata = (params: GetTokenMetadataParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosTokenMetadata(params)
    }
    throw new Error("Invalid chain key")
}