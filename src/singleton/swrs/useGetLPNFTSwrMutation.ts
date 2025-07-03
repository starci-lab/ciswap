import { useAppSelector } from "@/redux"
import { getLPNFT, GetLPNFTResponse } from "@/modules/blockchain"
import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "./types"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

export interface UseGetLPNFTSwrParams {
  poolId: number;
}

export const useGetLPNFTSwr = (): UseSWRMutation<
  GetLPNFTResponse,
  UseGetLPNFTSwrParams
> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const { account } = useWallet()
    const swrMutation = useSWRMutation(
        "LP_NFT",
        async (_, { arg }: { arg: UseGetLPNFTSwrParams }) =>
            getLPNFT({
                chainKey,
                poolId: arg.poolId,
                accountAddress: account?.address.toString() ?? "",
            })
    )
    return {
        swrMutation,
    }
}
