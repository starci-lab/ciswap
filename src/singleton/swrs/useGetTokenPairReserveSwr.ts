import { setTokenPairReserve, useAppDispatch,   useAppSelector } from "@/redux"
import { getTokenPairReserve, TokenPairReserve } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"

export const useGetTokenPairReserveSwr = (): UseSWR<TokenPairReserve> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const dispatch = useAppDispatch()
    const swr = useSWR(["TOKEN_PAIR_RESERVE", poolId], async () => {
        const tokenPairReserve = await getTokenPairReserve({ chainKey, network, poolId })
        dispatch(setTokenPairReserve(tokenPairReserve))
        return tokenPairReserve
    })
    return {
        swr,
    }
}
