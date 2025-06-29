import useSWRMutation from "swr/mutation"
import { useAppSelector } from "@/redux"
import { getAmountOut, GetAmountOutResult } from "@/modules/blockchain"
import { UseSWRMutation } from "./types"

export interface UseQuotePriceOutSwrParams {
    token0: string
    token1: string
    amountIn: number
    poolAddress: string
    zeroForOne: boolean
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
                token0: arg.token0,
                token1: arg.token1,
                amountIn: arg.amountIn,
                poolAddress: arg.poolAddress,
                zeroForOne: arg.zeroForOne,
                network
            })
    )
    return {
        swrMutation,
    }
}
