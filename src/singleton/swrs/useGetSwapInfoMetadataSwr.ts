import { useAppDispatch, useAppSelector } from "@/redux"
import { getSwapInfo, SwapInfo } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"
import { setSwapInfo } from "@/redux/slices"

export const useGetSwapInfoMetadataSwr = (): UseSWR<SwapInfo> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const dispatch = useAppDispatch()
    const swr = useSWR("SWAP_INFO", async () => {
        const swapInfo = await getSwapInfo({ chainKey, network })
        dispatch(setSwapInfo(swapInfo))
        return swapInfo
    })
    return {
        swr,
    }
}
