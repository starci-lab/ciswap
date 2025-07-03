import { useAppSelector } from "@/redux"
import { getTokenMetadata, TokenMetadata } from "@/modules/blockchain"
import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "./types"

export interface UseGetTokenMetadataSwrParams {
  tokenAddress: string;
  signal?: AbortSignal;
  isTypeTag?: boolean;
}

export const useGetTokenMetadataSwrMutation = (): UseSWRMutation<
  TokenMetadata,
  UseGetTokenMetadataSwrParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const swrMutation = useSWRMutation(
        "TOKEN_METADATA",
        async (_, { arg }: { arg: UseGetTokenMetadataSwrParams }) =>
            getTokenMetadata({ chainKey, tokenAddress: arg.tokenAddress, isTypeTag: arg.isTypeTag })
    )
    return {
        swrMutation,
    }
}
