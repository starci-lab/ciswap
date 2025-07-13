import useSWRMutation from "swr/mutation"
import { useAppSelector } from "@/redux"
import { getAmountOut, GetAmountOutResult } from "@/modules/blockchain"
import { UseSWRMutation } from "./types"

export interface UseQuotePriceOutSwrParams {
    amountIn: number
    poolId: number
    xForY: boolean
}
// ciswap only allow you to quote amount out due to the virtualized liquidity
export const useQuotePriceOutSwrMutation = (): UseSWRMutation<
  GetAmountOutResult,
  UseQuotePriceOutSwrParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const swrMutation = useSWRMutation(
        "QUOTE_PRICE_OUT",
        async (_, { arg }: { arg: UseQuotePriceOutSwrParams }) =>
            getAmountOut({
                chainKey,
                amountIn: arg.amountIn,
                poolId: arg.poolId,
                xForY: arg.xForY,
                network
            })
    )
    return {
        swrMutation,
    }
}
