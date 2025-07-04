import { AptosMoveTableHandle, ChainKey, Network } from "@/types"
import { createAptosClient } from "../rpcs"
import { aptosSwapResourceAccounts, buildAptosSwapFQN } from "@/config"

export interface GetTokenPairReserveParams {
  chainKey: ChainKey;
  network?: Network;
  poolId: number;
}

export interface AptosMoveTokenPairReserve {
    reserve_x: number, // Real reserve of token X
    reserve_y: number, // Real reserve of token Y
    reserve_debt_x: number, // Virtual reserve of X
    reserve_debt_y: number, // Virtual reserve of Y
    block_timestamp_last: number // Last update timestamp (seconds)
}

export interface AptosMoveTokenPairReserves {
    reserves: AptosMoveTableHandle
}

export interface TokenPairReserve {
  reserveX: number;
  reserveY: number;
  reserveDebtX: number;
  reserveDebtY: number;
}

export const getAptosTokenPairReserve = async ({
    network,
    poolId,
}: GetTokenPairReserveParams): Promise<TokenPairReserve> => {
    const aptosClient = createAptosClient(network)
    const tokenPairReserves = await aptosClient.getAccountResource<AptosMoveTokenPairReserves>({
        accountAddress: aptosSwapResourceAccounts[network ?? Network.Mainnet],
        resourceType: buildAptosSwapFQN({
            network,
            moduleName: "swap",
            functionNameOrResourceType: "TokenPairReserves",
        }),
    })
    const tokenPairReserve = await aptosClient.getTableItem<AptosMoveTokenPairReserve>({
        handle: tokenPairReserves.reserves.handle,
        data: {
            key: poolId.toString(),
            key_type: "u64",
            value_type: buildAptosSwapFQN({
                network,
                moduleName: "swap",
                functionNameOrResourceType: "TokenPairReserve",
            }),
        },
    })
    return {
        reserveX: tokenPairReserve.reserve_x,
        reserveY: tokenPairReserve.reserve_y,
        reserveDebtX: tokenPairReserve.reserve_debt_x,
        reserveDebtY: tokenPairReserve.reserve_debt_y,
    }
}

export const getTokenPairReserve = async (params: GetTokenPairReserveParams) => {
    switch (params.chainKey) {
    case ChainKey.Aptos:
        return await getAptosTokenPairReserve(params)
    }
    throw new Error("Invalid chain key")
}
