import { ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { computeDenomination } from "@/utils"
import { chainConfigs } from "../config"
import { aptosSwapResourceAccounts, buildAptosSwapFQN } from "@/config"

export interface GetSwapInfoParams {
  chainKey: ChainKey;
  network?: Network;
}

export interface AptosMoveSwapInfo {
    fee_to: string, // Address to receive protocol fees
    pool_creation_fee_apt: string, // Accumulated fees in APT
    admin: string, // Admin address
    creation_fee_in_apt: number, // Fee for creating a new pair
    next_pool_id: number, // Id of the next pool to be created
}

export interface SwapInfo {
  poolCreationFee: number;
  nextPoolId: number;
  adminAddress: string;
  feeToAddress: string;
}

export const getAptosSwapInfo = async ({
    network,
    chainKey,
}: GetSwapInfoParams): Promise<SwapInfo> => {
    const aptosClient = createAptosClient(network)
    const swapInfo = await aptosClient.getAccountResource<AptosMoveSwapInfo>({
        accountAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
        resourceType: buildAptosSwapFQN({
            network,
            moduleName: "swap",
            functionNameOrResourceType: "SwapInfo",
        }),
    })
    const decimals = chainConfigs[chainKey].decimals   
    return {
        poolCreationFee: computeDenomination(
            swapInfo.creation_fee_in_apt,
            decimals
        ),
        nextPoolId: swapInfo.next_pool_id,
        adminAddress: swapInfo.admin,
        feeToAddress: swapInfo.fee_to,
    }
}

export const getSwapInfo = (params: GetSwapInfoParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return getAptosSwapInfo(params)
    }
    throw new Error("Invalid chain key")
}
