import { useAppSelector } from "@/redux"
import { getTokenBalance, TokenBalance } from "@/modules/blockchain"
import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "./types"

export interface UseGetBalanceSwrMutationParams {
  tokenAddress: string;
  accountAddress: string;
  isTypeTag?: boolean;
}

export const useGetBalanceSwrMutation = (): UseSWRMutation<
  TokenBalance,
  UseGetBalanceSwrMutationParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const swrMutation = useSWRMutation(
        "TOKEN_BALANCE",
        async (_, { arg }: { arg: UseGetBalanceSwrMutationParams }) =>
            getTokenBalance({
                chainKey,
                tokenAddress: arg.tokenAddress,
                accountAddress: arg.accountAddress,
                isTypeTag: arg.isTypeTag,
            })
    )
    return {
        swrMutation,
    }
}
