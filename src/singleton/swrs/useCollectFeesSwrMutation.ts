import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"
import { PlatformKey, platformKeyToChainKey } from "@/types"
import {
    useAptosMoveCallSwrMutation,
    UseAptosMoveCallSwrMutationResponse,
} from "./useAptosMoveCallSwrMutation"
import { buildAptosFQN } from "@/config"
import { UseSWRMutation } from "./types"

export interface CollectFeesSwrMutationParams {
  nftAddress: string;
  recipientAddress: string;
}

export const useCollectFeesSwrMutation = (): UseSWRMutation<
  UseAptosMoveCallSwrMutationResponse,
  CollectFeesSwrMutationParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const { swrMutation: aptosMoveCallSwrMutation } =
    useAptosMoveCallSwrMutation()
    const swrMutation = useSWRMutation(
        "COLLECT_FEES",
        async (_, { arg }: { arg: CollectFeesSwrMutationParams }) => {
            switch (platformKeyToChainKey[chainKey]) {
            case PlatformKey.Aptos: {
                const data = await aptosMoveCallSwrMutation.trigger({
                    function: buildAptosFQN({
                        functionNameOrResourceType: "collect_fees",
                        moduleName: "router",
                        network,
                    }),
                    typeArguments: [],
                    functionArguments: [
                        poolId || 0,
                        arg.nftAddress,
                        arg.recipientAddress,
                    ],
                })
                return data
            }
            default:
                throw new Error("Unsupported chain")
            }
        }
    )
    return {
        swrMutation,
    }
}
