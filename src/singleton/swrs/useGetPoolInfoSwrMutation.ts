import { useAppSelector } from "@/redux"
import { getPoolInfo, PoolInfo } from "@/modules/blockchain"
import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "./types"

export interface UseGetPoolInfoSwrParams {
  poolId: number;
}

export const useGetPoolInfoSwrMutation = (): UseSWRMutation<
  PoolInfo,
  UseGetPoolInfoSwrParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const swrMutation = useSWRMutation(
        "POOL_INFO_MUTATION",
        async (_, { arg }: { arg: UseGetPoolInfoSwrParams }) =>
            getPoolInfo({ chainKey, poolId: arg.poolId })
    )
    return {
        swrMutation,
    }
}
