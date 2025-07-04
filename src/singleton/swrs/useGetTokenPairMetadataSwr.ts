import { setTokenPairMetadata, useAppDispatch, useAppSelector } from "@/redux"
import { getTokenPairMetadata, TokenPairMetadata } from "@/modules/blockchain"
import { UseSWR } from "./types"
import useSWR from "swr"

export const useGetTokenPairMetadataSwr = (): UseSWR<TokenPairMetadata> => {
    const chainKey = useAppSelector((state) => state.chainReducer.chainKey)
    const network = useAppSelector((state) => state.chainReducer.network)
    const poolId = useAppSelector((state) => state.homeReducer.poolId)
    const dispatch = useAppDispatch()
    const swr = useSWR(["TOKEN_PAIR_METADATA", poolId], async () => {
        const tokenPairMetadata = await getTokenPairMetadata({ chainKey, network, poolId })
        dispatch(setTokenPairMetadata(tokenPairMetadata))
        return tokenPairMetadata
    })
    return {
        swr,
    }
}
