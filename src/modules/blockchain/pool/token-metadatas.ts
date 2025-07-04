import {
    ChainKey,
    Network,
} from "@/types"
import { createAptosClient } from "../rpcs"
import { buildAptosSwapFQN } from "@/config"
import { getTokenMetadata, TokenMetadata } from "../token"

export interface GetTokenMetadatasParams {
  chainKey: ChainKey;
  network?: Network;
  poolId: number;
}

export interface TokenMetadatas {
  // TODO: get token metadata
  tokenXMetadata: TokenMetadata;
  tokenYMetadata: TokenMetadata;
  tokenDebtXMetadata: TokenMetadata;
  tokenDebtYMetadata: TokenMetadata;
}

export const getAptosTokenMetadatas = async ({
    network,
    poolId,
    chainKey,
}: GetTokenMetadatasParams): Promise<TokenMetadatas> => {
    const aptosClient = createAptosClient(network)
    const [
        tokenXAddress, 
        tokenYAddress, 
        tokenDebtXAddress, 
        tokenDebtYAddress
    ] = await aptosClient.view({
        payload: {
            function: buildAptosSwapFQN({
                network,
                moduleName: "swap",
                functionNameOrResourceType: "get_tokens",
            }),
            functionArguments: [poolId.toString()],
            typeArguments: [],
        },
    })
    const result: Partial<TokenMetadatas> = {}
    const setToken0Metadata = async () => {
        const metadata = await getTokenMetadata({
            chainKey,
            network,
            tokenAddress: tokenXAddress as string,
        })
        result.tokenXMetadata = metadata
    }
    const setToken1Metadata = async () => {
        const metadata = await getTokenMetadata({
            chainKey,
            network,
            tokenAddress: tokenYAddress as string,
        })
        result.tokenYMetadata = metadata
    }
    const setTokenDebtXMetadata = async () => {
        const metadata = await getTokenMetadata({
            chainKey,
            network,    
            tokenAddress: tokenDebtXAddress as string,
        })
        result.tokenDebtXMetadata = metadata
    }
    const setTokenDebtYMetadata = async () => {
        const metadata = await getTokenMetadata({
            chainKey,
            network,
            tokenAddress: tokenDebtYAddress as string,
        })
        result.tokenDebtYMetadata = metadata
    }
    await Promise.all([
        setToken0Metadata(),
        setToken1Metadata(),
        setTokenDebtXMetadata(),
        setTokenDebtYMetadata(),
    ])      
    return result as TokenMetadatas
}

export const getTokenMetadatas = async (params: GetTokenMetadatasParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return await getAptosTokenMetadatas(params)
    }
    throw new Error("Invalid chain key")
}
