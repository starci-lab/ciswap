import { ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { APTOS_SWAP_RESOURCE_ACCOUNT } from "@/config"
import { computeDenomination, computeRaw } from "@/utils"

export interface GetAmountOutParams {
  chainKey: ChainKey;
  network?: Network;
  amountIn: number;
  poolId: number;
  zeroForOne: boolean;
}

export interface GetAmountOutResult {
    amountOut: number;
    amountVirtualOut: number;
}

export const getAptosAmountOut = async ({
    network,
    amountIn,
    poolId,
    zeroForOne,
}: GetAmountOutParams): Promise<GetAmountOutResult> => {
    const aptosClient = createAptosClient(network)
    console.log("poolId", poolId)
    console.log("amountIn", amountIn)
    console.log("zeroForOne", zeroForOne)
    const data = await aptosClient.view(
        {
            payload: {
                function: `${APTOS_SWAP_RESOURCE_ACCOUNT}::quoter::get_amount_out`,
                typeArguments: [],
                functionArguments: [
                    poolId,
                    computeRaw(amountIn),
                    zeroForOne,
                ]
            }
        }
    )
    return {
        amountOut: computeDenomination(data[0]?.toString() ?? "0", 8),
        amountVirtualOut: computeDenomination(data[1]?.toString() ?? "0", 8),
    }
}

export const getAmountOut = (params: GetAmountOutParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosAmountOut(params)
    }
    throw new Error("Invalid chain key")
}