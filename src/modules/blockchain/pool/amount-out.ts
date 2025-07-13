import { ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { buildAptosFQN } from "@/config"
import { computeDenomination, computeRaw } from "@/utils"

export interface GetAmountOutParams {
  chainKey: ChainKey;
  network?: Network;
  amountIn: number;
  poolId: number;
  xForY: boolean;
}

export interface GetAmountOutResult {
    amountOut: number;
    amountVirtualOut: number;
}

export const getAptosAmountOut = async ({
    network,
    amountIn,
    poolId,
    xForY,
}: GetAmountOutParams): Promise<GetAmountOutResult> => {
    const aptosClient = createAptosClient(network)
    const data = await aptosClient.view(
        {
            payload: {
                function: buildAptosFQN({
                    network,
                    moduleName: "quoter",
                    functionNameOrResourceType: "get_amount_out",
                }),
                typeArguments: [],
                functionArguments: [
                    poolId,
                    computeRaw(amountIn),
                    xForY,
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