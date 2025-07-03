import { useAppSelector } from "@/redux"
import { PoolInfo } from "@/modules/blockchain"
import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "./types"

export interface UseGetLPNFTSwrParams {
  poolId: number;
}

export const useGetLPNFTSwr = (): UseSWRMutation<
  PoolInfo,
  UseGetLPNFTSwrParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const swrMutation = useSWRMutation(
        "LP_NFT",
        async (_, { arg }: { arg: UseGetLPNFTSwrParams }) =>
            getLPNFT({ chainKey, poolId: arg.poolId })
    )
    return {
        swrMutation,
    }
}
